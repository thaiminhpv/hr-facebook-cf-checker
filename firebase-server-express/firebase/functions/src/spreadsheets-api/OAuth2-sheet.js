const fs = require('fs');
const {google} = require('googleapis');
const database = require('../database/tokenDAO');

// const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']; //read-only
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']; // write/read

const SERVER_UPLOAD = 0
const LOCAL_DEBUG = 1
const MODE = LOCAL_DEBUG

let authentication = null
let pending_callback = null

/**
 * call API
 * @param callback {Promise<*>}
 * @returns {Promise<*>}
 */
function getAuth(callback) {
    return new Promise((resolve, reject) => {
        fs.readFile('./resources/client_secret.json', (err, content) => {
            if (err) reject(new Error('Error loading client secret file:', err));
            return authorize(JSON.parse(content), callback)
        });
    })
}

function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[MODE]); //1 for debug locally

    authentication = oAuth2Client

    // Check if we have previously stored a token.
    return database.getToken().then(token => {
        if (!token) return saveCodeToLocal(oAuth2Client, callback);
        // if we DO have previously stored a token.
        console.log('hereeeeee!')
        console.log('token before parse: ')
        console.log(token)
        console.log('token after parse: ')
        console.log(JSON.parse(token))
        oAuth2Client.setCredentials(JSON.parse(token));
        // pending_callback = null //clear
        return callback(oAuth2Client);
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

    pending_callback = callback
    return database.setLinkAuth(JSON.stringify(authUrl)).then(response => {
        console.log(response)
        console.log(`authUrl stored to fire-store, which is ${authUrl}
        Go to /link-auth to get link`);
        return response
    })
}

function getTokenFromCode(code) {
    if (authentication === null)
        throw new Error('authentication is null')

    return authentication.getToken(code, (err, token) => {
        if (err) {
            console.log('Error while trying to retrieve access token: --')
            return Promise.reject(err);
        }
        authentication.setCredentials(token);
        // Store the token to disk for later program executions
        database.setToken(JSON.stringify(token)).then(response => {
            console.log(response)
            console.log('token has been stored to fire-store')
            return response
        }).catch(err => console.error(err));
        return pending_callback(authentication);
    })
}

module.exports = {getAuth, getTokenFromCode}