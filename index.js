/*
 * TODO:
 *  1. create Google Spreadsheet format
 *  2. get Facebook API query Post
 *  3. get list comments
 *  4. get list user comments (use Set (no duplicate user))
 *  map user ID with their real name / GGSheet ID / num row
 *  5. get Google Spreadsheet API
 *  6. write code that who has been checked (API Google Spreadsheet side) with timestamp
 *  7. build CUI with 2 parameter: post ID and sheet ID
 *  8. get Facebook API post trigger automatically query update data every 2h
 *  9. get Facebook API post trigger automatically insert 5 comments auto: HR, Medes, PR,...
 *  10. Google Spreadsheet conditional formatting color base on the difference with deadline
 *  11. push to Firebase
 *  12. Count as score
 *  13. Draw charts
 *  14. Build Web service with frontend (+Express,...)
 *  consider case that we can do all these things at Google Dev Console
 *  consider use selenium with call RestAPI from virtual Browser
 *  consider get extended access token (60 days) instead of 2-hour live long token
 */

const {putSpreadsheetsAPI, getSpreadsheetsAPI} = require('./sheets-api-v4/rest-api-sender');
const {getGroupFirstPostID, getCommentsFromPostID, getReplyComments} = require('./facebook-fetcher/facebook');

const {spreadsheets, facebook} = require('./resources/config.json');

const {sheets_id, range, sheets_name, API_key} = spreadsheets
const {access_token, group_id} = facebook


console.log('App Running')

getGroupFirstPostID(access_token, group_id).then(postID => {
    console.log('PostID has been gotten: ', postID)
    return getCommentsFromPostID(access_token, postID)
}).then((listIDCommentDepartment) => {
    console.log('listIDCommentDepartment: ', listIDCommentDepartment)
    let userCf_ed = []
    listIDCommentDepartment.forEach((department) => {
        userCf_ed.push(getReplyComments(access_token, department))
    })
    // FIXME: userCf_ed is a list of Promise, not has been execute successfully yet
    console.log('usercf_ed', userCf_ed)
    return userCf_ed
}).then(response => {
    console.log(response)
    console.log("Done!");
}).catch(error => {
    console.log("Something went wrong: ", error.response.data.error.message)
})

// }).then(response => {
//     callSpreadsheetsAPI({ sheets_id, range, sheets_name, API_key })
// })
