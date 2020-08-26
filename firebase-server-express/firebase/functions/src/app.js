const express = require('express');
const {modifySpreadsheet} = require('./spreadsheets-api/rest-api-sender');
const {getTokenFromCode} = require('./spreadsheets-api/OAuth2-sheet');
const database = require('./database/tokenDAO');
const {changeConfigFile, readRawFile} = require('./database/fileManager')

const app = express();

app.set('view engine', 'ejs');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/', (req, res) => {
    console.log('unexpected GET request')
    console.log(req.query)
    res.redirect('/config');
})

// ------------get data from facebook ----------
app.get('/facebook-endpoint', (req, res) => {
    //TODO: mode at req.query.mode here
    let userCfArray = JSON.parse(req.query.data);
    let mode = req.query.mode
    console.log("facebook-endpoint received: ------")
    console.log(userCfArray)
    res.json(userCfArray)

    modifySpreadsheet(userCfArray, mode).then((response) => {
        console.log(response)
        console.log('Done! in app.js')
        return response
    }).catch(error => console.log(error));
})

// get token for OAuth2 from Google
app.get('/api-token', (req, res) => {
    console.log('API get token');
    console.log(req.query)
    let code = req.query.code
    console.log(code)
    try {
        getTokenFromCode(code)
    } catch (e) {
        console.log(e)
    }
    res.redirect(`https://docs.google.com/spreadsheets/d/${require('../resources/config.json').main_spreadsheets.sheets_id}/edit`);
})

// link for user login
app.get('/link-auth', (req, res) => {
    database.getLinkAuth().then(link => {
        console.log(link)
        if (link === null) res.redirect(`https://docs.google.com/spreadsheets/d/${require('../resources/config.json').main_spreadsheets.sheets_id}/edit`);
        else res.redirect(link)
        return link
    }).catch(error => {
        console.log(error)
        res.send(error)
    });
});

app.post('/', (req, res) => {
    console.log('POST request')
    console.log(req.body)
    let userCfArray = req.body.data;
    res.send("POST successfully")
})

// -------------GET FILE --------------
app.get('/injection/caller', (req, res) => {
    res.sendfile('./resources/browser-inject-js/caller.html')
})

app.get('/injection/inject', (req, res) => {
    res.sendfile('./resources/browser-inject-js/inject.js')
})

app.get('/config', (req, res, next) => {
    database.getLinkAuth().then(link => {
        console.log(link)
        return res.render('config', {
            data: require('../resources/config.json'),
            status: link === null ? req.query.status : 'token timed out'
        })
    }).catch(error => {
        console.log(error)
        res.render('config', {
            data: require('../resources/config.json'),
            status: error.message
        })
    });
})

app.post('/config', ((req, res, next) => {
    console.log('post request')
    console.log(req.body);
    try {
        changeConfigFile(req.body);
        res.redirect('/config?status=done')
    } catch (e) {
        console.log(e)
        res.redirect('/config?status=fail')
    }
}))

module.exports = app;
