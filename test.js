const {callSpreadsheetsAPI} = require('./sheets-api-v4/rest-api-sender');
const {getGroupFirstPostID, getCommentsFromPostID, getReplyComments} = require('./facebook-fetcher/facebook');

const {spreadsheets, facebook} = require('./config.json');

const {sheets_id, range, sheets_name, API_key} = spreadsheets
const {access_token, group_id} = facebook

const axios = require('axios');

console.log('App Testing')

const testingCommentID = '155026662501603'
const URL = `https://graph.facebook.com/${testingCommentID}` ///comments`

axios.get(URL, {
    params: {
        access_token: access_token
    }
}).then((response) => {
    console.log(response.data.data)
}).catch((error) => {
    console.log(error)
})
// getGroupFirstPostID(access_token, group_id).then(postID => {
//     console.log('PostID has been gotten: ', postID)
//     return getCommentsFromPostID(access_token, postID)
// }).then((listIDCommentDepartment) => {
//     console.log('listIDCommentDepartment: ', listIDCommentDepartment)
//     let userCf_ed = []
//     listIDCommentDepartment.forEach((department) => {
//         userCf_ed.push(getReplyComments(access_token, department))
//     })
//     // FIXME: userCf_ed is a list of Promise, not has been execute successfully yet
//     console.log('usercf_ed', userCf_ed)
//     return userCf_ed
// }).then(response => {
//     console.log(response)
//     console.log("Done!");
// }).catch(error => {
//     console.log("Something went wrong: ", error.response.data.error.message)
// })

// }).then(response => {
//     callSpreadsheetsAPI({ sheets_id, range, sheets_name, API_key })
// })
