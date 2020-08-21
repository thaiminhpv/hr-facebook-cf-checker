const express = require('express');
const {modifySpreadsheet} = require('./spreadsheets-api/rest-api-sender');
const {getTokenFromCode} = require('./spreadsheets-api/OAuth2-sheet');

const app = express();


app.get('/', (req, res) => {
    console.log('GET request')
    console.log(req.query)
    res.send("GET successfully")
})

app.get('/facebook-endpoint', (req, res) => {
    let userCfArray = JSON.parse(req.query.data);
    // let userCfArray = ["Phạm Vũ Thái Minh","Đỗ Thị Hà Linh","Kim Ha","Nguyễn Mi","鈴木菫","Khanh Duong","Nguyễn Thanh Hiền","Trần Thanh Ngân","Nguyễn Hồng Phúc","Minh Phúc","Ngô Vũ Quỳnh Anh","Hoang Minh Tung","Nguyễn Hương","Tuan Minh Do Xuan","Lê Thảo","Dương Diệu Thúy","Nguyễn Mạnh Hà","Khuong Viet Dung"]
    modifySpreadsheet(userCfArray).then((response) => console.log('Done!')).catch(error => console.log(error));
    res.json(userCfArray)
})

app.get('/api-token', (req, res) => {
    console.log('API get token');
    console.log(req.query)
    let code = req.query.code
    console.log(code)
    getTokenFromCode(code)
    res.redirect(`https://docs.google.com/spreadsheets/d/${require('../../resources/config.json').spreadsheets.sheets_id}/edit`)
})

app.get('/link-auth', (req, res) => {
    try {
        const link = require('../../resources/linkOAuth2.json');
        console.log(link)
        res.redirect(link)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
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

// exports.app = functions.https.onRequest(app);
module.exports = app;