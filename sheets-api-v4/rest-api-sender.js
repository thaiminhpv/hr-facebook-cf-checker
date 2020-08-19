const axios = require('axios');


//    "group_id": "598883897329508"155017612502508

// console.log(getCommentsFromPostID("155017612502508_155026279168308"))
// console.log(getReplyComments(155051485832454))

/**
 * need OAuth2 to edit document
 * @param sheets_id
 * @param range
 * @param sheets_name
 * @param API_key
 * @param values
 * @returns {Promise<AxiosResponse<any>>}
 */
async function putSpreadsheetsAPI({sheets_id, range, sheets_name, API_key}, values) {
    const spreadsheetsURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheets_id}/values/${sheets_name}!${range}`;
    console.log(spreadsheetsURL)
    return await axios.put(spreadsheetsURL,{
        body: {
            "range": `${sheets_name}!${range}`,
            "majorDimension": "COLUMNS",
            "values": values,
        }
    }, {
        params: {
            key: API_key,
            majorDimension: "COLUMNS",
            valueInputOption: "USER_ENTERED"
        },
    }).then(response => {
        return response.data;
    })
}

/**
 * Just need API_key and can only access to public read_only document
 * @param sheets_id
 * @param range
 * @param sheets_name
 * @param API_key
 * @returns {Promise<AxiosResponse<any>>}
 */
async function getSpreadsheetsAPI({sheets_id, range, sheets_name, API_key}) {
    const spreadsheetsURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheets_id}/values/${sheets_name}!${range}`;
    return await axios.get(spreadsheetsURL, {
        params: {
            key: API_key,
            majorDimension: "COLUMNS"
        }
    }).then(response => {
        return response.data.values;
    })
}


module.exports = {getSpreadsheetsAPI, putSpreadsheetsAPI}