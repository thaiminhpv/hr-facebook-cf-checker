const {modifySpreadsheet, getSpreadsheetsAPI, putSpreadsheetsAPI} = require('./sheets-api-v4/rest-api-sender');
const {getGroupFirstPostID, getCommentsFromPostID, getReplyComments} = require('./facebook-fetcher/facebook');

const {spreadsheets, facebook} = require('./config.json');

const {sheets_id, range, sheets_name, API_key} = spreadsheets
const {access_token, group_id} = facebook

const axios = require('axios');

console.log('App Testing')

const testingCommentID = '155026662501603'
const URL = `https://graph.facebook.com/${testingCommentID}` ///comments`


let userCfArray = ["Phạm Vũ Thái Minh","Đỗ Thị Hà Linh","Kim Ha","Nguyễn Mi","鈴木菫","Khanh Duong","Nguyễn Thanh Hiền","Trần Thanh Ngân","Nguyễn Hồng Phúc","Minh Phúc","Ngô Vũ Quỳnh Anh","Hoang Minh Tung","Nguyễn Hương","Tuan Minh Do Xuan","Lê Thảo","Dương Diệu Thúy","Nguyễn Mạnh Hà","Khuong Viet Dung"]
modifySpreadsheet(userCfArray)

// values = ['abc', 123, '456']
// putSpreadsheetsAPI({sheets_id, range, sheets_name, API_key}, values)
//     .then(response => {
//         console.log('got them')
//         console.log(response)
//     }).catch(error => {
//     console.log("Something went wrong: ", error.response.data.error.message)
// })
//
//
// const {GoogleSpreadsheet} = require('google-spreadsheet');
// const creds = require('./backup-useless/sheets-api-v3/client-secret.json');

// async function accessGoogleSpreadsheet() {
//     const doc = await new GoogleSpreadsheet('1eWVXODuj6-hcppcancwgqw5yuyrbxqLzR4RhoZZ7xBE');
//     await doc.useServiceAccountAuth(creds);
//     await doc.getInfo().then(response => {
//         console.log("reach there!")
//         console.log(response)
//     })
//     console.log('1')
//     return doc
//     // console.log(promise)
//     // await doc.getInfo();
//     // console.log(info)
// }

// accessGoogleSpreadsheet()
//     .then((response) => {
//         console.log('Done!')
//         console.log(response)
//     }).catch(error => {
//     console.log(error);
// });
// // axios.get("https://www.googleapis.com/auth/spreadsheets", {
// //     params: {
// //
// //     }
// // }).then((response) => {
// //     console.log(response.data.data)
// // }).catch((error) => {
// //     console.log("Something went wrong: ", error.response.data.error.message)
// // })
// //
