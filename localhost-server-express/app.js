const express = require('express');
const {modifySpreadsheet} = require('../sheets-api-v4/rest-api-sender');

const app = express();


// let userCfArray = ["Phạm Vũ Thái Minh","Đỗ Thị Hà Linh","Kim Ha","Nguyễn Mi","鈴木菫","Khanh Duong","Nguyễn Thanh Hiền","Trần Thanh Ngân","Nguyễn Hồng Phúc","Minh Phúc","Ngô Vũ Quỳnh Anh","Hoang Minh Tung","Nguyễn Hương","Tuan Minh Do Xuan","Lê Thảo","Dương Diệu Thúy","Nguyễn Mạnh Hà","Khuong Viet Dung"]
// modifySpreadsheet(userCfArray).then((response) => console.log('Done!'))

// TODO: create Database (MongoDB) to store token
app.get('/', (req, res) => {
    console.log('GET request')
    console.log(req.query)
    res.send("GET successfully")
})

app.get('/facebook-endpoint', (req, res) => {
    let userCfArray = JSON.parse(req.query.data);
    // let userCfArray = ["Phạm Vũ Thái Minh","Đỗ Thị Hà Linh","Kim Ha","Nguyễn Mi","鈴木菫","Khanh Duong","Nguyễn Thanh Hiền","Trần Thanh Ngân","Nguyễn Hồng Phúc","Minh Phúc","Ngô Vũ Quỳnh Anh","Hoang Minh Tung","Nguyễn Hương","Tuan Minh Do Xuan","Lê Thảo","Dương Diệu Thúy","Nguyễn Mạnh Hà","Khuong Viet Dung"]
    modifySpreadsheet(userCfArray).then((response) => console.log('Done!'))
    res.json(userCfArray)
})

app.get('/api-token', (req, res) => {
    console.log('API get token');
    console.log(req.query)
    //TODO: connect with OAuth2-sheet.js automatically
    res.send('API token get')
})

app.post('/', (req, res) => {
    console.log('POST request')
    console.log(req.body)
    let userCfArray = req.body.data;
    res.send("POST successfully")
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`running on ${port}...`);
})
