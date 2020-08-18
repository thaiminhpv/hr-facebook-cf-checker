const axios = require('axios');
const {spreadsheets, facebook} = require('./config.json');

const {sheets_id, range, sheets_name, API_key} = spreadsheets
const {access_token, group_id} = facebook


//    "group_id": "598883897329508"155017612502508

// console.log(getCommentsFromPostID("155017612502508_155026279168308"))
// console.log(getReplyComments(155051485832454))

getGroupFirstPostID().then(postID => {
    return getCommentsFromPostID(postID)
}).then((listIDCallCf) => {
    let userCf_ed = []
    listIDCallCf.forEach((department) => {
        userCf_ed.push(getReplyComments(department))
    })
    return userCf_ed
}).then(response => {
    console.log(response)
    console.log("Done!");
})

// callSpreadsheetsAPI();

async function getReplyComments(commentID) {
    console.log("getting reply comments from comment " + commentID)
    const URL = `https://graph.facebook.com/${commentID}/comments`
    return await axios.get(URL, {
        params: {
            access_token: access_token
        }
    })
        .then(response => {
            // return list of user commented
            let user = []
            response.data.data.forEach((reply_comment) => {
                // push whole object with @Name just for debugging purpose
                user.push(reply_comment.from)
            })
            console.log(response.data.data);
            return user
        })
        .catch(error => {
            console.log(error);
        });
}

async function getCommentsFromPostID(post_id) {
    console.log("getting comments from post " + post_id)
    const URL = `https://graph.facebook.com/${post_id}/comments`
    return await axios.get(URL, {
        params: {
            access_token: access_token
        }
    })
        .then(response => {
            // return list of IDs of comments like PR,HR,Medes,...
            // FIXME: can't have permission to get other users'id except myself's id
            let list_id = []
            response.data.data.forEach((department) => {
                list_id.push(department.from)
            })
            console.log(response.data.data);
            return list_id
            console.log(response.data.data[0]);
            return response.data.data[0].id
        })
        .catch(error => {
            console.log(error);
        });
}

async function getGroupFirstPostID() {
    const URL = `https://graph.facebook.com/${group_id}/feed`
    return await axios.get(URL, {
        params: {
            access_token: access_token,
            // limit: 1
        }
    })
        .then(response => {
            console.log(response.data.data[3]); //0
            return response.data.data[3].id //0
        })
        .catch(error => {
            console.log(error);
        });
}

function callSpreadsheetsAPI() {
    const spreadsheetsURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheets_id}/values/${sheets_name}!${range}`;
    axios.get(spreadsheetsURL, {
        params: {
            key: API_key,
            majorDimension: "COLUMNS"
        }
    })
        .then(response => {
            console.log(response.data.values);
        })
        .catch(error => {
            console.log(error);
        });
}

