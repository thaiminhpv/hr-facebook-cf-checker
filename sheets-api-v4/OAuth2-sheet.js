const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']; //read-only
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']; // write/read
const TOKEN_PATH = '../resources/token.json';
const LINK_AUTH_PATH = '../resources/linkOAuth2.json'

let authentication = null
let pending_callback = null

async function callAPI(callback) {
    fs.readFile('../resources/client_secret.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        authorize(JSON.parse(content), callback);
    });
}

function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.web;
    // TODO: tạo cổng authen trên express -> store token trả về
    // TODO: sau này khi up lên firebase, consider tạo một cổng dẫn vào dường link lấy token
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    authentication = oAuth2Client

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        // if (err) return getNewToken(oAuth2Client, callback);
        if (err) return saveCodeToLocal(oAuth2Client, callback);
        // if we DO have previously stored a token.
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
        pending_callback = null //clear
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
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function saveCodeToLocal(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    fs.writeFile(LINK_AUTH_PATH, JSON.stringify(authUrl), (err) => {
        if (err) return console.error(err);
        console.log(`authUrl stored to ${LINK_AUTH_PATH}, which is ${authUrl}
        Go to /link-auth to get link`);
    });
    pending_callback = callback
}

function getTokenFromCode(code) {
    authentication.getToken(code, (err, token) => {
        if (err) return console.error('Error while trying to retrieve access token', err);
        authentication.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log('Token stored to', TOKEN_PATH);
        });
        pending_callback(authentication);
    })
}

module.exports = {callAPI, getTokenFromCode}