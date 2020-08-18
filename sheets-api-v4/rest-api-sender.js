const querystring = require('querystring');
const https = require('https');

const { sheets_id, range, sheets_name, API_key } = require('./config.json');

// const URL = `https://sheets.googleapis.com/v4/spreadsheets/${sheets_id}/values/${sheets_name}!${range}?key=${API_key}`;
const URL = `https://sheets.googleapis.com/v4/spreadsheets/${sheets_id}/values/${sheets_name}!${range}`
// console.log(URL);

const parameters = {
    key: API_key
}

const link = `${URL}?key=${API_key}`;
console.log(link);
// send request
const request = https.request(link, (response) => {
    // response from server
    console.log("3");
    console.log(response.body);
});
console.log("2");

// In case error occurs while sending request
request.on('error', (error) => {
    console.log("4");
    console.log(error.message);
});

request.end();

// https.get(URL, (res) => {
//     console.log(res.body);
// })