const axios = require('axios');
const callAPI = require('./OAuth2-sheet');
const {google} = require('googleapis');

/**
 * @deprecated
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
    return await axios.put(spreadsheetsURL, {
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
 * @deprecated
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

/**
 * @deprecated
 * @param array
 * @returns {Promise<void>}
 */
async function modifySpreadsheet_v3(array) {
    const {GoogleSpreadsheet} = require('google-spreadsheet');
    const {spreadsheets: {sheets_id}} = require('../config.json');
    const credentials = require('../backup-useless/sheets-api-v3/client-secret.json');

    const doc = new GoogleSpreadsheet(sheets_id);
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo(); // loads document properties and worksheets
    console.log(doc.title);

    const sheet = doc.sheetsByIndex[1]; //0 is official, 1 is testing
    console.log(sheet.title);
    await sheet.loadCells('C4:D42')


    const D5 = sheet.getCellByA1('D5');
    const currentDate = await getDate();
    // FIXME: @currentDate is raw string date format, just need to find way to convert it into Date on spreadsheet and done!
    // consider tạo ra một sheet là queue, và có code Google App Script dequeue theo chu kỳ -> cần tìm hiểu khả năng của Google App Script
    D5.value = currentDate

    // const a1 = sheet.getCell(0, 0); // access cells using a zero-based index //absolute position
    // const c6 = sheet.getCellByA1('C6'); // or A1 style notation
    // console.log(c6.value);
    // console.log(c6.formula);
    // console.log(c6.formattedValue);
    // c6.value = 123.456;
    // c6.formula = '=A1';

    // D5.textFormat = {numberFormat: 'DATE_TIME'};

    await sheet.saveUpdatedCells(); // save all updates in one call
}

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
async function modifySpreadsheet_v4(array) {
    const {spreadsheets: {sheets_id, sheets_name, range}} = require('../config.json');
    const mapID = require('../userMapID.json');
    const peopleCount = 39;

    await callAPI((auth) => {
        const sheets = google.sheets({version: 'v4', auth});
        let values = convertUserCfToWriteableTime(array, mapID, peopleCount);

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

module.exports = {getSpreadsheetsAPI, putSpreadsheetsAPI, modifySpreadsheet: modifySpreadsheet_v4, readSpreadsheetsData};