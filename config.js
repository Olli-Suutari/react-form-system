const fs = require('fs');

const configPath = './configuration.json';
const parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));

// Export each object in order to access them seperately
exports.crypto = parsed.crypto;
exports.expressSession = parsed.expressSession;
exports.emailAddress = parsed.emailAddress;
exports.mongoose = parsed.mongoose;
exports.domain = parsed.domain;
exports.captchaSecret = parsed.captchaSecret;

/*
* IN ADDITION TO THESE CONFIGURATIONS WE NEED TO CONFIGURE THE FOLLOWING THINGS:
*
* INFO's are all fetched and updated by CUID, THESE CAN BE CREATED BY RUNNING THE InitialData.js
*
* Google's Invisible reCaptcha requires a key. The key is added directly to:
* src/components/enlist/components/draftForm/DraftCreateWidget.jsx (sitekey)
* Get Invisible reCaptcha from here:
* https://www.google.com/recaptcha/intro/ < Requires a Google account.
*
* EMAIL FROM: In nodemailer we need to specify from: 'Name' + Address when sending mail.
* There are 5 references to uni5cqvlsuzmxmik@ethereal.email in:
* routes/Account.js and routes/Drafts.js
*
*   The default email address is via Ethreal, this does not send messages,
*   but the "sent" messages can be viewed at https://ethereal.email/messages
*   Example configuration for gmail:
    "emailAddress": {
    "host": "smtp.gmail.com",
    "port": "465",
    "secure": "true",
    "auth": {
      "user": "address@gmail.com",
      "pass": "Password"
    }
  },
*
*
* PORT: There's a mention of port 8000 in app.js
*
*/
