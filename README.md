<strong>Note: As of February 2020 this repository is a bit outdated and the project which this was based on was updated recently </strong>

<strong>TO DO: Update + React hooks</strong>

This repository is based on a work project.

The system includes an application form and the management page for viewing the sent applications.

Application form features:
- Text, email, select, Wysiwyg text editor, pdf attachments
- Form validation
- Multi lingual
- Invisible reCAPTCHA
- Shows sent form details in modal
- Sends confirmation email to the given email
- View instructions, cookies, terms & conditions

Management features:
- Two user levels, normal and admin
- Login/password reset pages
- Edit instructions, cookies, terms & conditions
- Receive email notifications of new applications, disable/enable them
- View and search the applications
- Send instruction emails to applicants
- Delete applications (admin)
- Add/delete users (admin)
- Edit instructions(form & email) and terms & conditions (admin)

The following events are logged: New applications, logins, viewing applications and adding or deleting users.

Key technologies:
- React 16 & Redux
- MongoDB
- Webpack/Babel
- ECMAScript 6
- Node


**How to boot for localhost**

**1. Node.js | MongoDB | React installations**

a) Download and install Node.js:

https://nodejs.org/en/

b) Download and install MongoDB:

https://www.mongodb.com/

Follow these instructions:

https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

Allow all rights to firewall if promted.

Create "\data\db" folder structure to the root of C:

**2. Starting Mongodb**

a) Open a console and type:

"C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe"

b) Open a new console and type:

"C:\Program Files\MongoDB\Server\3.6\bin\mongo.exe"

**3. Starting the app**

Note! If you have not installed node modules do it with:

npm install

type to console:

npm start

You can now visit the Form(enlist) page at:

127.0.0.1:8000

And the Management page at:

127.0.0.1:8000/management

Note! We use 127.0.0.1 instead of localhost, because it is required for the Google Captcha.

Note! The info's required will be created on first boot and the following 2 lines in app.js should be commented:
const initialData = require('./routes/dbModels/InitialData');
initialData();

**To create the first User, you need to manually add it to the DB :**

To do this, open the console which is running mongo.exe and copy paste the following:

use draft

db.users.insert( {salt :"a",
hash: "b",
email: "your@mail.com", 
username:"aq9FMm20W195bwV",
emailNotifications:true,
isAdmin:true,
passwordReset:""
} )

After the user is created, reset the password via:

http://127.0.0.1:8000/management/reset-password

Once logged in as an admin, you can create new users from the UI.


**Configuration**

See: config.json and config.js

Also **READ THE COMMENTS in config,js**


**Production build**

First we need to build the production bundle:

npm run build-prod

Then we must start the production build:

npm run start-prod

**Code Standards**

If possible, use eslint, the configuration file includes some rules.
Code standards are loosely based on:
https://github.com/airbnb/javascript/tree/master/react
Max line width: 140 characters.

**TO DO:**

- Create better code standards and Eslint
- Translate Google Captcha based on language selection:
https://github.com/dozoisch/react-google-recaptcha/issues/67
- If we open more than 6 tabs in Chrome, there won't be sockets:
  https://superuser.com/questions/499114/how-to-increase-chromes-connections-per-server
- Use enter key for sending formsy forms
- Unit testing
- Cross-platform testing(Safari, mobile browsers...)
- Add a button for sending test mails on mailInfo dialogue
- etc..
- Update to Mongoose 5 > Warning! Things break if we update the package from v4.
- Warning: connect.session() MemoryStore is not
  designed for a production environment, as it will leak
  memory, and will not scale past a single process.
- IE BUGS: Auth does not work on management page.
