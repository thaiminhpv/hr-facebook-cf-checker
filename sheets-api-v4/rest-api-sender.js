const axios = require('axios');
const callAPI = require('./OAuth2-sheet');
const {google} = require('googleapis');

/**
 * Get today
 * @returns {string}
 */
function getDate() {
    let date = new Date()
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes() + 1}:00`
}

/**
 * miêu tả thuật toán: từ @array ta đem so sánh với Map
 * -> chỉ lấy ra một cái array chứa index của những ô cần điền ngày giờ
 * @param array
 * @param mapID
 * @param peopleCount
 * @returns 2-dimensional array
 */
function convertUserCfToWriteableTime(array, mapID, peopleCount) {
    let idCf = array.map((e) => mapID[e])
    console.log(idCf)
    const today = getDate();
    let values = []
    for (let i = 0; i < peopleCount; i++) {
        values.push(idCf.includes(i) ? [getDate()] : [])
    }
    console.log(values)
    return values;
}

/**
 * Usable
 * @version v4
 * @param array
 * @returns {Promise<void>}
 */
async function modifySpreadsheet(array) {
    const {spreadsheets: {sheets_id, sheets_name, range}} = require('../config.json');
    const mapID = require('../userMapID.json');
    const peopleCount = 39;

    await callAPI((auth) => {
        const sheets = google.sheets({version: 'v4', auth});
        let values = convertUserCfToWriteableTime(array, mapID, peopleCount);

        //FIXME: read from Sheets first to ignore existed value
        sheets.spreadsheets.values.update({
            spreadsheetId: sheets_id,
            range: `${sheets_name}!${range}`,
            valueInputOption: 'USER_ENTERED',
            resource: {
                // majorDimension: "COLUMNS",
                values: values
            }
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            const rows = res.data;
            console.log('rows: ');
            console.log(rows)
        });
    })

}

/**
 * @readonly
 * @returns {Promise<void>}
 */
async function readSpreadsheetsData() { // read current spreadsheet data
    sheets.spreadsheets.values.get({
        spreadsheetId: sheets_id,
        range: `${sheets_name}!${range}`,
        majorDimension: "COLUMNS",
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        if (rows.length) {
            console.log('Name \t Major:');
            console.log(rows)
        } else {
            console.log('No data found.');
        }
    });

}

module.exports = { modifySpreadsheet , readSpreadsheetsData};