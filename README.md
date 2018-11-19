# TCPinger
TCP Health Monitor

TCPinger is a highly configurable TCP Health monitor. It effectively pings multiple TCP endpoints on a defined interval and will optionally send an email alert after 
5 consecutive failures.

## Usage
 1. Download the version appropriate for your OS from [releases](https://github.com/MichaelLeeHobbs/TCPinger/releases)
 2. Assuming you rename it to tcpinger or tcpinger.exe
 3. On first run TCPinger will generate the healthChecks.json
 4. The healthChecks.json file is made up of three sections - see below
 5. tcpinger - will use the default healthChecks.json
 6. Optionally you can use a different config file: tcpinger ./otherChecks.json
 
 ### healthChecks.json
 #### General Settings
 * alert: false - The top level alert should be set to true or false and will be the default setting for checks when checks do not have a alert setting defined
 * from: tcpinger TCP Health Monitor - The from string for email alerts
 * to: john.doe@gmail.com - The email address to send alerts to
 
 #### sendmail
 * TCPinder uses [nodemailer.com](https://nodemailer.com/) to send emails. The sendmail object will be passed to nodemailer.createTransport thus all Nodemailer options are supported. See: [SMTP transport](https://nodemailer.com/smtp/)
 * host - email server ip or address
 * port: 465 - email server port
 * secure: true - use secure?
 * auth: 
    * user - user name - should use environment variable: sendmail_user 
    * pass - password - should use environment variable: sendmail_pass 
    * clientId - optional client ID - should use environment variable: sendmail_pass - See Nodemailer for more details 
    * clientSecret - optional client Secret - should use environment variable: sendmail_clientSecret - See Nodemailer for more details
    
#### checks
* checks is an array of tcp endpoint to check
* name - can be any string value. Useful for logging, should avoid spaces to avoid breaking log parsers.
* address - ip or hostname of endpoint
* ports: [80] - an array of ports to check on the endpoint
* attempts: 5 - number of times to tcp ping a endpoint each check
* timeout: 1000 - time in milliseconds before giving up on an attempt
* frequency: 60 - time in seconds of how often to check an endpoint
* alert: optional, will override the default alert setting

## Todo
* add test
* expand command line options
* better handle endpoint flapping and alerting
* add docker deployment guide
