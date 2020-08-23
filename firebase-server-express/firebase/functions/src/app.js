const express = require('express');
const {modifySpreadsheet} = require('./spreadsheets-api/rest-api-sender');
const {getTokenFromCode} = require('./spreadsheets-api/OAuth2-sheet');
const database = require('./database/tokenDAO');

const app = express();

app.get('/', (req, res) => {
    console.log('unexpected GET request')
    console.log(req.query)
    res.send("unexpected GET successfully")
})

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

app.get('/api-token', (req, res) => {
    console.log('API get token');
    console.log(req.query)
    let code = req.query.code
    console.log(code)
    getTokenFromCode(code).then((response) => {
        console.log(response)
        res.redirect(`https://docs.google.com/spreadsheets/d/${require('../resources/config.json').main_spreadsheets.sheets_id}/edit`)
        return response
    }).catch(reason => {
        console.error(reason)
        res.send(reason)
    });
})

app.get('/link-auth', (req, res) => {
    database.getLinkAuth().then(link => {
        console.log(link)
        res.redirect(link)
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

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`running on ${port}...`);
// })

module.exports = app;