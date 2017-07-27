# line2mail
Email you when Line chat happened

## Install library dependencies
`npm install`

## Usage
`mv Config_template.js Config.js`  
### Configure all variables in Config.js.  
1. privkey, cert, ca are certificates need by SSL, you can generate them using Let's Encrypt https://letsencrypt.org
2. channelAccessToken: is retrieve from Line developer site
3. mailList: is a list of email address that LineBot will send.
4. sendFrom: send from which email address.
5. subject: email subject.
6. port: LineBot listen on which port.

## Run
`nodejs LineBot.js`
