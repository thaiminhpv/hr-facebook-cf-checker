const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// code queried :  4/3AG-c4bT_8k4ezBz64XCuDUa1KgsCrMvQsbyfsDPjzkEIrw88JwBLFBo7mVUBSe_lk3pJIJq1V6OjgtXT-JhbV8

// const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']; //read-only
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']; // write/read
const TOKEN_PATH = 'token.json';

async function callAPI(callback) {
    fs.readFile('./client_secret.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        authorize(JSON.parse(content), callback);
    });
}

function authorize(credentials, callback) {
    // const {client_secret, client_id, redirect_uris} = credentials.installed;
    const {client_secret, client_id, redirect_uris} = credentials.web;
    // const {web : {client_secret, client_id, redirect_uris}} = require('../client_secret.json');
    // TODO: tạo cổng authen trên express -> store token trả về
    // TODO: sau này khi up lên firebase, consider tạo một cổng dẫn vào dường link lấy token
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function listMajors(auth) {
    //TODO!: this work! incredible! find way to do the same things with our sheets (copy and modify, not write from scratch)
    const sheets = google.sheets({version: 'v4', auth});
    sheets.spreadsheets.values.get({
        spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
        range: 'Class Data!A2:E',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        if (rows.length) {
            console.log('Name, Major:');
            // Print columns A and E, which correspond to indices 0 and 4.
            rows.map((row) => {
                console.log(`${row[0]}, ${row[4]}`);
            });
        } else {
            console.log('No data found.');
        }
    });
}

module.exports = callAPI