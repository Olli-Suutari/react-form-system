// Setup nodemailer
import nodemailer from 'nodemailer';
import { emailAddress, domain } from '../config';
const transporter = nodemailer.createTransport(emailAddress);
const appConfig = require('../config');
const crypto = require('crypto');
const passport = require('passport');
const express = require('express');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const User = require('./dbModels/User');
const Log = require('./dbModels/Log');

const router = express.Router();

// configure mongoose promises
mongoose.Promise = global.Promise;

// GET to /checksession
router.get('/checksession', (req, res) => {
    if (req.user) {
        return res.send(JSON.stringify(req.user));
    }
    return res.send(JSON.stringify({}));
});

// GET to /logout
router.get('/logout', (req, res) => {
    req.logout();
    return res.send(JSON.stringify(req.user));
});


// POST to /login
router.post('/login', async (req, res) => {
    // look up the user by their email
    req.body.email = mongoSanitize.sanitize(req.body.email);
    const query = User.findOne({ email: req.body.email });
    const foundUser = await query.exec();
    // if they exist, they'll have a username, so add that to our body
    if (foundUser) { req.body.username = foundUser.username; }
    passport.authenticate('local')(req, res, () => {
        // If logged in, we should have user info to send back
        if (req.user) {
            // Save details to log.
            try {
                const log = new Log({
                    userID: req.user.email,
                    userAction: 'Logged in.',
                });
                log.save();
            }
            catch (err) {
                console.log('There was an error in logging the login: ' + err);
            }

            return res.send(JSON.stringify(req.user));
        }

        // Otherwise return an error
        return res.send(JSON.stringify({ error: 'There was an error logging in' }));
    });
});

router.get('/getUsers', async (req, res) => {
    User.find({}, { email: 1, isAdmin: 1 }).exec((err, users) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        // If we perform the sorting in MongoDB query, we will be hitting the 32MB RAM limit very fast.
        users.reverse();
        return res.send(users);
    });
});

router.post('/toggleNotifications', async (req, res) => {
    let result;
    User.findOneAndUpdate({ email: req.body.userEmail },
        {
            $set:
                {
                    emailNotifications: req.body.userNotifications,
                }
        }, function (err) {
            if (err) {
                console.log('Something went wrong when updating data! ' + err);
                result = res.send(JSON.stringify({ error: 'Something went wrong when mail sent status!' + err }));
            }
            else
            {
                result = res.send(JSON.stringify({ success: true }));
            }
        });
    return result;
});

// POST to /register
router.post('/register', async (req, res) => {
    let result;
    // First, check and make sure the email doesn't already exist
    req.body.user.email = mongoSanitize.sanitize(req.body.user.email);
    const query = User.findOne({ email: req.body.user.email });
    const foundUser = await query.exec();
    if (foundUser) {
        result = res.send(JSON.stringify({ error: 'User with this email already exists' }));
        // Create a user object to save, using values from incoming JSON
        // Generate a random password, this will never be used since user will be sent a password reset link after the account is created.
    }
    else {
        // TO DO: We generate the initial password here, we should do the same for the username.
        const randomPass = crypto.randomBytes(20).toString('hex');
        const newUser = new User(req.body.user);
        // Save, via Passport's "register" method, the user
        return User.register(newUser, randomPass, (err) => {
            // If there's a problem, send back a JSON object with the error
            if (err) {
                result = res.send(JSON.stringify({ error: 'Something went wrong in creating the user: ' + err }));
            }
            else
            {
                try {
                    const log = new Log({
                        userID: req.body.userEmail,
                        userAction: 'Created user: ' + req.body.user.email,
                    });
                    log.save();
                }
                catch (err) {
                    console.log('There was an error in creating a log entry for user creation: ' + err);
                }
                result = res.send(JSON.stringify({ success: true }));
            }
        });
    }
    return result;
});

router.post('/deleteUser', async (req, res) => {
    let result;
    User.deleteOne({ email: req.body.userToDelete }, function (err) {
        if (err)
        {
            console.log('Something went wrong when deleting the user! ' + err);
            result = res.send(JSON.stringify({ error: 'Something went wrong when deleting the user!' + err }));
        }
        else {
            const mailOptions = {
                from: '"Noreply" <uni5cqvlsuzmxmik@ethereal.email>',
                to: req.body.userToDelete,
                subject: 'Your account has been deleted',
                text: 'The application system administrator has deleted your account.\n\n' +
                'This message cannot be responded to.'
            };
            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    result = res.send(JSON.stringify({ error: 'There was an error in sending mail to deleted user' }));
                }
                else {
                    try {
                        const log = new Log({
                            userID: req.body.userEmail,
                            userAction: 'Deleted user: ' + req.body.userToDelete,
                        });
                        log.save();
                    }
                    catch (err) {
                        console.log('There was an error in logging user deletion: ' + err);
                    }
                    result = res.send(JSON.stringify({ success: true }));
                }
            });
        }
    });
    return result;
});

// POST to savepassword
router.post('/savepassword', async (req, res) => {
    let result;
    // look up user in the DB based on reset hash
    const query = User.findOne({ passwordReset: req.body.hash });
    const foundUser = await query.exec();
    // If the user exists save their new password
    if (foundUser) {
        // user passport's built-in password set method
        foundUser.setPassword(req.body.formData.password, (err) => {
            if (err) {
                result = res.send(JSON.stringify({ error: 'Password could not be saved. Please try again' }));
            } else {
                // once the password's set, save the user object
                foundUser.save((error) => {
                    if (error) {
                        result = res.send(JSON.stringify({ error: 'Password could not be saved. Please try again' }));
                    } else {
                        // Send a success message
                        result = res.send(JSON.stringify({ success: true }));
                    }
                });
            }
        });
    } else {
        console.log('Error, hash not found for password reset. This is probably an old hash.');
        result = res.send(JSON.stringify({ error: 'Reset hash not found in database.' }));
    }
    return result;
});

// POST to saveresethash
router.post('/saveresethash', async (req, res) => {
    let result;
    // check and make sure the email exists
    const query = User.findOne({ email: req.body.email });
    const foundUser = await query.exec();
    if (foundUser)
    {
        // If the user exists, save their password hash
        const timeInMs = Date.now();
        const hashString = `${req.body.email}${timeInMs}`;
        const secret = appConfig.crypto.secret;
        foundUser.passwordReset = crypto.createHmac('sha256', secret)
            .update(hashString)
            .digest('hex');
        foundUser.save((err) => {
            if (err) {
                result = res.send(JSON.stringify({ error: 'Something went wrong while attempting to reset your password. Please Try again' }));
            }
            else
            {
                const mailOptions = {
                    from: '"Noreply" <uni5cqvlsuzmxmik@ethereal.email>',
                    to: foundUser.email,
                    subject: 'Password reset',
                    text: 'Hi! You can reset your password by clicking the following link:\n' +
                    domain + '/management/new-password/' + foundUser.passwordReset +
                    '\nThis email is sent to new users automatically. If you have already changed your password or did not order the ' +
                    'reset, you can ignore this message.'
                };
                transporter.sendMail(mailOptions, (error) => {
                    if (error) {
                        result = res.send(JSON.stringify({ error: 'There was an error in sending the password reset link' }));
                    }
                    else {
                        result = res.send(JSON.stringify({ success: true }));
                    }
                });
            }
        });
    }
    else
    {
        result = res.send(JSON.stringify({ error: 'No user was found with this password.' }));
    }
    return result;
});

module.exports = router;
