const tcpp = require('tcp-ping')
const SendMail = require('./SendMail')
const fs = require('fs-extra')
let checks = new Map()

const defaultConfig = {
    "alert": false,
    "from": "TCPinger - TCP Health Monitor",
    "to": "john.doe@gmail.com",
    "sendmail": {
        "host": "mail.google.com",
        "port": 465,
        "secure": true,
        "auth": {
            "user": "john.doe",
            "pass": "p@ssw0rd!"
        }
    },
    "checks": [
        {
            "name": "localhost",
            "address": "127.0.0.1",
            "ports": [22,80],
            "attempts": 5,
            "timeout": 1000,
            "frequency": 10
        },
        {
            "name": "Google",
            "address": "www.google.com",
            "ports": [80, 443],
            "attempts": 5,
            "timeout": 1000,
            "frequency": 60,
            "alert": true
        }
    ]
}

const createHealthCheck = ({name = 'localhost', address = 'localhost', port = 80, attempts = 5, timeout = 1000, frequency = 60, sendMail, alert, from, to}) => {
    frequency = frequency * 1000
    return setInterval(()=>{
        tcpp.ping({ address, port, attempts, timeout }, (err, {address, port, avg, max, min}) => {
            let state = isNaN(avg) ? 'DOWN' : 'UP'
            avg = isNaN(avg) ? '-' : avg
            max = (max === undefined) ? '-' : max
            min = (min === undefined) ? '-' : min

            let dtStr = (new Date()).toISOString()
            let key = `${name}:${port}`
            let check = checks.get(key)
            if (state !== check.state) {
                // this is to avoid rapid up/down email spam
                if (state === 'UP' && check.previousState === 'UP' ) {
                    check.checks = 5
                    check.state = state
                } else {
                    check.checks = 1
                    check.previousState = check.state
                    check.state = state
                }
            } else {
                check.checks++
                if (check.checks > Number.MAX_SAFE_INTEGER) {
                    check.checks = 6
                }
                if (check.state !== check.previousState && check.checks > 5) {
                    if (check.previousState === 'init') {
                        console.log(`${dtStr} ${name} ${address}:${port} Initial health checks passed, changed state to ${state}`)
                    } else {
                        let subject = `${dtStr} ${name} ${address}:${port} ALERT changed state to ${state}`
                        console.log(subject)
                        if (alert && sendMail) {
                            sendMail({
                                from,
                                to,
                                subject,
                                body: subject
                            })
                        }
                    }
                    check.previousState = check.state
                }
            }
            console.log(`${dtStr} ${name} ${address}:${port} ${state} avg: ${avg} max: ${max} min: ${min}`);
        })
    },frequency)
}

const main = async () => {
    try {
        let src = process.argv[2] ? process.argv[2] : './healthChecks.json'
        let fileExist = await fs.pathExists(src)
        if (!fileExist) {
            console.log(`Config file "${src}" not found!`)
            if (src === './healthChecks.json') {
                console.log('Generating default example "healthChecks.json"')
                fs.writeFileSync(src, JSON.stringify(defaultConfig, null, 2))
            } else {
                console.log('Cannot continue!')
                return
            }
        }

        const file = fs.readFileSync(src).toString()
        const config = JSON.parse(file)
        let sendMail = undefined
        if (config.sendmail) {
            config.sendmail.auth = (config.sendmail.auth) ? config.sendmail.auth : {}
            config.sendmail.auth.user = (process.env.sendmail_user) ? process.env.sendmail_user : config.sendmail.auth.user
            config.sendmail.auth.pass = (process.env.sendmail_pass) ? process.env.sendmail_pass : config.sendmail.auth.pass
            config.sendmail.auth.clientId = (process.env.sendmail_clientId) ? process.env.sendmail_clientId : config.sendmail.auth.clientId
            config.sendmail.auth.clientSecret = (process.env.sendmail_clientSecret) ? process.env.sendmail_clientSecret : config.sendmail.auth.clientSecret
            if ((config.sendmail.auth.user && config.sendmail.auth.pass) || (config.sendmail.auth.clientId && config.sendmail.auth.clientSecret)) {
                sendMail = SendMail(config.sendmail)
            }
        }

        config.checks.forEach(({name, address, ports, attempts, timeout, frequency, alert, from, to})=>{
            alert = (alert !== undefined) ? alert : config.alert
            from = (from !== undefined) ? from : config.from
            to = (to !== undefined) ? to : config.to
            ports.forEach(port=>{
                let key = `${name}:${port}`
                checks.set(key, {previousState: 'init', state: 'init', checks: 0})
                createHealthCheck({name, address, port, attempts, timeout, frequency, sendMail, alert, from, to})
            })
        })
    } catch (e) {
        console.log(`Usage: tcpinger [config.json]`)
        console.log(`Example: tcpinger healthChecks.json`)
        console.error(e)
    }
}

main().catch((e)=>console.error(`FATAL ERROR!`, e))


