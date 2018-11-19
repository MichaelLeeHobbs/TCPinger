const nodemailer = require('nodemailer')

const initTransport = ({host, port = 465, secure = true, auth}) => nodemailer.createTransport({host, port, secure, auth})
const SendMail = (config) => {
    const transport = initTransport(config)
    return (mailOptions) => transport.sendMail(mailOptions, (error, info) => (error) ? console.error(error) : console.log(info))
}

module.exports = SendMail