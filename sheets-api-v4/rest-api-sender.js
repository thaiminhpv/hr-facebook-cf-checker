const axios = require('axios');


//    "group_id": "598883897329508"155017612502508

// console.log(getCommentsFromPostID("155017612502508_155026279168308"))
// console.log(getReplyComments(155051485832454))

function callSpreadsheetsAPI({sheets_id, range, sheets_name, API_key}) {
    const spreadsheetsURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheets_id}/values/${sheets_name}!${range}`;
    axios.get(spreadsheetsURL, {
        params: {
            key: API_key,
            majorDimension: "COLUMNS"
        }
    }).then(response => {
        console.log(response.data.values);
    })
}


module.exports = {callSpreadsheetsAPI}