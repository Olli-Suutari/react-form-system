// Setup nodemailer
import nodemailer from 'nodemailer';
import { emailAddress, captchaSecret } from '../config';
const transporter = nodemailer.createTransport(emailAddress);
// Database dbModels
const Draft = require('./dbModels/Draft');
const Info = require('./dbModels/Info');
const User = require('./dbModels/User');
const Log = require('./dbModels/Log');

const express = require('express');
const request = require('request');
const mongoose = require('mongoose');
const cuid = require('cuid');
const slug = require('limax');
const mongoSanitize = require('express-mongo-sanitize');
const router = express.Router();
// configure mongoose promises
mongoose.Promise = global.Promise;

router.post('/adddraft', (req, res) => {
    let result;
    // Make sure that the captcha is not empty.
    if (req.body.captcha === undefined || req.body.captcha === '' || req.body.captcha === null) {
        console.log('Captcha was empty');
        result = res.send(JSON.stringify({ error: 'Captcha was empty' }));
    }
    else {
        // Request captcha verification from Google.
        const verificationURL = 'https://www.google.com/recaptcha/api/siteverify?secret=' + captchaSecret + '&response=' +
            req.body.captcha + '&remoteip=' + req.connection.remoteAddress;
        request(verificationURL, function (error, response, body) {
            body = JSON.parse(body);
            // If the verification failed.
            if (body.success !== undefined && !body.success) {
                console.log('reCaptcha verification failed! ' + error);
                result = res.send(JSON.stringify({ error: 'Failed captcha verification' }));
            }
            // Otherwise we will store the draft to the database.
            else {
                const newDraft = new Draft(req.body);
                // Let's sanitize inputs
                newDraft.title = mongoSanitize.sanitize(newDraft.title);
                newDraft.name = mongoSanitize.sanitize(newDraft.name);
                newDraft.email = mongoSanitize.sanitize(newDraft.email);
                newDraft.organisation = mongoSanitize.sanitize(newDraft.organisation);
                newDraft.members = mongoSanitize.sanitize(newDraft.members);
                newDraft.description = mongoSanitize.sanitize(newDraft.description);
                newDraft.heardFrom = mongoSanitize.sanitize(newDraft.heardFrom);
                newDraft.cuid = cuid();
                newDraft.slug = slug(newDraft.title.toLowerCase(), { lowercase: true });
                newDraft.save((err) => {
                    if (err) {
                        console.log('Saving of the draft failed! ' + error);
                        result = res.send(JSON.stringify({ error: 'Draft could not be saved.' }));
                    }
                    else {
                        result = res.send(JSON.stringify({ success: true }));
                        // Try to log the adding of the new draft
                        try {
                            const log = new Log({
                                userID: newDraft.name,
                                userAction: 'Sent a new application: ' + newDraft.title,
                            });
                            log.save();
                        }
                        catch (err) {
                            console.log('There was an error in logging the new application: ' + err);
                        }
                        // Send email to the email address of the draft sender.
                        const mailOptions = {
                            from: '"Noreply" <uni5cqvlsuzmxmik@ethereal.email>',
                            to: newDraft.email,
                            subject: 'Hakemus vastaanotettu | Application received',
                            text: 'Lähetit juuri hakemuksen, saat sähköpostiisi uuden viestin lisäohjeineen, kun hakemus on ' +
                            'tarkistettu.\n\nYour application has been sent. You will receive ' +
                            'additional instructions via email once the application is checked.'
                        };
                        transporter.sendMail(mailOptions, (error) => {
                            if (error) {
                                console.log('There was an error in sending the confirmation mail to the applicant: ' + error);
                            }
                        });
                        // TO DO: Add a setting by which users can decide to not receive these mails.
                        User.find(
                            { emailNotifications: { $ne: false } },
                            { email: 1 })
                            .then((emailsFound) => {
                                if (err) {
                                    console.log(err);
                                }
                                if (emailsFound.length !== 0) {
                                    const mailOptions = {
                                        from: '"Noreply" <uni5cqvlsuzmxmik@ethereal.email>',
                                        bcc: emailsFound,
                                        subject: 'New application',
                                        text: 'A new application was sent.\n\n' +
                                        'You can view the application details from the management page. ' +
                                        '\n\nIf you no longer wish to receive these notifications, you can disable them from ' +
                                        'your accounts settings.',
                                    };
                                    // send email with defined transport object
                                    transporter.sendMail(mailOptions, (error) => {
                                        if (error) {
                                            console.log('Error in sending mail to draft team: ' + error);
                                        }
                                    });
                                }
                            });
                    }
                });
            }
            });
        }
        return result;
    });


router.get('/getdrafts', async (req, res) => {
    Draft.find({}, { title: 1, name: 1, dateAdded: 1, email: 1, cuid: 1, checkedMailSent: 1 }).exec((err, drafts) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        // If we perform the sorting in MongoDB query, we will be hitting the 32MB RAM limit very fast.
        drafts.reverse();
        return res.send(drafts);
    });
});

router.get('/get20drafts', async (req, res) => {
    Draft.find({}, { title: 1, name: 1, dateAdded: 1, email: 1, cuid: 1, checkedMailSent: 1 })
        .sort({ $natural: -1 }).limit(20).exec((err, drafts) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        return res.send(drafts);
    });
});

router.get('/get50drafts', async (req, res) => {
    Draft.find({}, { title: 1, name: 1, dateAdded: 1, email: 1, cuid: 1, checkedMailSent: 1 })
        .sort({ $natural: -1 }).limit(50).exec((err, drafts) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        return res.send(drafts);
    });
});

router.post('/draftTextSearch', (req, res) => {
    /**
     * This searches the DB for titles/names that match the provided search term.
     * It uses mongoDB $or to check for both fields and only returns titles, names, dateAdded, email, cuid and checkedmailsent.
     * It also sorts the items so the newest come first.
     */
    const text = req.body.searchTerm;
    let drafts = [];
    const promises = [];
    Draft.find(
        { $or: [{ title: { $regex: text, $options: 'i' } },
                { name: { $regex: text, $options: 'i' } }] },
        { title: 1, name: 1, dateAdded: 1, email: 1, cuid: 1, checkedMailSent: 1 }).sort({ $natural: -1 })
        .then((draftsFound) => {
            drafts = draftsFound;
            for (let i = 0; i < drafts.length; i += 1) {
                promises.push(drafts[i]);
            }
            return Promise.all(promises);
        })
        .then((drafts) => {
            return res.send(drafts);
        })
        .catch((reason) => {
            return res.status(500).send(reason);
        });
});


router.post('/getdraft', (req, res) => {
    Draft.findOne({ cuid: req.body.cuid }).exec((err, draft) => {
        if (err) {
            return res.status(500).send(err);
        }
        try {
            const log = new Log({
                userID: req.body.userEmail,
                userAction: 'Opened an application sent by ' + draft.name,
            });
            log.save();
        }
        catch (err) {
            console.log('There was an error in logging the viewing of the application details: ' + err);
        }
        return res.json({ draft });
    });
});

/**
 * This finds a matching cuid and sets checkedMailSent to true and sends the email.
 *
 * @param req
 * @param res
 * @returns void
 */
 router.post('/sendInstructionEmail', async (req, res) => {
     let result;
     let instructions;
     const query = Info.findOne({ cuid: 'cikqgkv4q01ck7453ualdn3hd' });
     const foundInfo = await query.exec();
     if (foundInfo.infoFi) {
         instructions = foundInfo;
         Draft.findOne({ cuid: req.body.draft.cuid },
             function (err, doc) {
                 if (err) {
                     console.log('Something went wrong when fetching the draft details from database.!');
                     result = res.send(JSON.stringify({ error: 'Something went wrong when fetching the draft details from database.' }));
                 }
                 else
                 {
                     const mailOptions = {
                         from: '"Noreply" <uni5cqvlsuzmxmik@ethereal.email>',
                         to: doc.email,
                         subject: 'Hakemuksesi on tarkistettu | Application checked',
                         text: instructions.emailInfoFi + '\n\n' + instructions.emailInfoEn,
                     };
                     // send email with defined transport object
                     transporter.sendMail(mailOptions, (error) => {
                         if (error) {
                             console.log('Error in sending mail: ' + error);
                             result = res.send(JSON.stringify({ error: 'Error in sending mail: ' + error }));
                         }
                         else
                         {
                             Draft.findOneAndUpdate({ cuid: req.body.draft.cuid },
                                 {
                                     $set:
                                         {
                                             checkedMailSent: true,
                                         }
                                 }, function (err) {
                                     if (err) {
                                         console.log('Something went wrong when updating data! ' + err);
                                         result = res.send(JSON.stringify({ error: 'Something went wrong when mail sent status!' + err }));
                                     }
                                     else
                                     {
                                         setTimeout(
                                             function ()
                                             {
                                                 result = res.send(JSON.stringify({ success: true }));
                                             }, 300);
                                     }
                                 });
                         }
                     });
                 }
             });
     }
     else
     {
         console.log('There was an error in fetching the email instructions.');
         result = res.send(JSON.stringify({ error: 'There was an error in fetching the email instructions.' }));
     }
     return result;
});

router.post('/deleteDraft', async (req, res) => {
    let result;
    Draft.deleteOne({ cuid: req.body.cuid }, function (err) {
        if (err)
        {
            console.log('Something went wrong when deleting the draft! ' + err);
            result = res.send(JSON.stringify({ error: 'Something went wrong when deleting the draft!' + err }));
        }
        else {
            try {
                const log = new Log({
                    userID: req.body.userEmail,
                    userAction: 'Deleted an application sent on: ' + req.body.dateSent,
                });
                log.save();
            }
            catch (err) {
                console.log('There was an error in logging the deletion: ' + err);
            }
            result = res.send(JSON.stringify({ success: true }));
        }
    });
    return result;
});

module.exports = router;
