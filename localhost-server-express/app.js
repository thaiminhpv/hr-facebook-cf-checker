const express = require('express');
const spreadsheets = require('../sheets-api-v4/rest-api-sender');

const app = express();

// TODO: create Database (MongoDB) to store token
app.get('/', (req, res) => {
    console.log('GET request')
    console.log(req.query)
    // let userCfArray = JSON.parse(req.query.data);
    // TODO: Call Spreadsheet API update data on @userCfArray
    // let userCfArray = ["Phạm Vũ Thái Minh","Đỗ Thị Hà Linh","Kim Ha","Nguyễn Mi","鈴木菫","Khanh Duong","Nguyễn Thanh Hiền","Trần Thanh Ngân","Nguyễn Hồng Phúc","Minh Phúc","Ngô Vũ Quỳnh Anh","Hoang Minh Tung","Nguyễn Hương","Tuan Minh Do Xuan","Lê Thảo","Dương Diệu Thúy","Nguyễn Mạnh Hà","Khuong Viet Dung"]
    // spreadsheets.modifySpreadsheet(userCfArray)
    res.sendStatus(200);
    res.send("GET successfully")
})

app.post('/', (req, res) => {
    console.log('POST request')
    console.log(req.body)
    let userCfArray = req.body.data;
    res.send("GET successfully")
    res.sendStatus(200);
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`runnning on ${port}...`);
})
