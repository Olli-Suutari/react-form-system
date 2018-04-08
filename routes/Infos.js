/* eslint-disable import/newline-after-import */
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Info = require('./dbModels/Info');

// configure mongoose promises
mongoose.Promise = global.Promise;

router.get('/fetchInfo', async (req, res) => {
    let result;
    const query = Info.findOne({ cuid: 'cikqgkv4q01ck7453ualdn3hd' });
    const foundInfo = await query.exec();
    if (foundInfo.infoFi) {
	    result = foundInfo;
    }
	else {
	    result = res.send(JSON.stringify({ error: 'Some of the provided infos were empty.' }));
	}
    return res.send(JSON.stringify(result));
});

router.post('/updateInfo', (req, res) => {
    let result;
    // Make sure all input fields are filled
    if (!req.body.infoTextFi || !req.body.infoTextEn || !req.body.emailInfoFi || !req.body.emailInfoEn) {
        console.log('Some of the provided infos were empty.');
        result = res.send(JSON.stringify({ error: 'Some of the provided infos were empty.' }));
    }
    else {
        // Update info texts
        Info.findOneAndUpdate({ cuid: 'cikqgkv4q01ck7453ualdn3hd' }, { $set:
                { infoFi: req.body.infoTextFi,
                    infoEn: req.body.infoTextEn,
                    emailInfoFi: req.body.emailInfoFi,
                    emailInfoEn: req.body.emailInfoEn,
                    termsFi: req.body.termsFi,
                    termsEn: req.body.termsEn } }).exec(function (err) {
            if (err) {
                console.log('There was an error in updating the infos: ' + err);
                result = res.send(JSON.stringify({ error: 'There was an error in updating the infos: ' + err }));
            } else {
                result = res.send(JSON.stringify({ success: true }));
            }
        });
    }
    return result;
});

module.exports = router;
