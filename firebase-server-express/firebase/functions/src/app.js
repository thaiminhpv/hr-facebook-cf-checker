const express = require('express');
const {modifySpreadsheet} = require('./spreadsheets-api/rest-api-sender');
const {getTokenFromCode} = require('./spreadsheets-api/OAuth2-sheet');
const database = require('./database/tokenDAO');
const fs = require('fs');

const app = express();

app.get('/', (req, res) => {
    console.log('unexpected GET request')
    console.log(req.query)
    res.send("unexpected GET successfully")
})

// get data from facebook
app.get('/facebook-endpoint', (req, res) => {
    let userCfArray = JSON.parse(req.query.data);
    console.log("facebook-endpoint received: ------")
    console.log(userCfArray)
    res.json(userCfArray)

    modifySpreadsheet(userCfArray).then((response) => {
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
    res.sendfile('./resources/browser-inject-js/caller.js')
})

app.get('/injection/inject', (req, res) => {
    res.sendfile('./resources/browser-inject-js/inject.js')
})

app.get('/config', (req, res, next) => {
    //TODO: setup reactjs to send current settings to client
    res.sendfile('./resources/UI/config.html');
})

app.post('/config', ((req, res, next) => {
    console.log('post request')
    console.log(req.body);
    changeConfigFile(req.body);
    res.sendfile('./resources/config.json')
}))

function changeConfigFile({main_sheet_id, main_sheet_name, main_range, map_sheet_id, map_sheet_name, map_range}) {
    let configFile = require('../resources/config.json');
    //note: we don't need API_key anymore
    configFile.main_spreadsheets = {
        sheets_id: main_sheet_id,
        sheets_name: main_sheet_name,
        range: main_range
    }
    configFile.map_user_id = {
        sheets_id: map_sheet_id,
        sheets_name: map_sheet_name,
        range: map_range
    }
    console.log(configFile)
    fs.writeFileSync('./resources/config.json', JSON.stringify(configFile));
}


module.exports = app;
