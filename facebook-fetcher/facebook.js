const axios = require('axios');


async function getReplyComments(access_token, commentID) {
    console.log("getting reply comments from comment " + commentID)
    const URL = `https://graph.facebook.com/${commentID}/comments`
    return await axios.get(URL, {
        params: {
            access_token: access_token
        }
    }).then(response => {
        // return list of user commented
        let user = []
        response.data.data.forEach((reply_comment) => {
            // push whole object with @Name just for debugging purpose
            user.push(reply_comment.from)
        })
        console.log(response.data.data);
        return user
    })
}

async function getCommentsFromPostID(access_token, post_id) {
    console.log("getting department comments from post " + post_id)
    const URL = `https://graph.facebook.com/${post_id}/comments`
    return await axios.get(URL, {
        params: {
            access_token: access_token
        }
    }).then(response => {
        // return list of IDs of comments like PR,HR,Medes,...
        let list_id = []
        response.data.data.forEach((department) => {
            // ERROR: can't have permission to get other users'id except myself's id
            list_id.push(department.id)
        })
        console.log('data: ', response.data.data)
        console.log('list id', list_id)
        return list_id
    })
}

async function getGroupFirstPostID(access_token, group_id) {
    const URL = `https://graph.facebook.com/${group_id}/feed`
    return await axios.get(URL, {
        params: {
            access_token: access_token,
            // limit: 1
        }
    }).then(response => {
        console.log(response.data.data[3]); //3 just for debug purpose, will later change to 0
        return response.data.data[3].id //0
    })
}

module.exports = {getReplyComments, getCommentsFromPostID, getGroupFirstPostID}