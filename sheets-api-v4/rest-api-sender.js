const axios = require('axios');
const {callAPI} = require('./OAuth2-sheet');
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
function convertUserCfToWriteableTime(array, peopleCount) {
    const today = getDate();
    let values = []
    for (let i = 0; i < peopleCount; i++) {
        values.push(array.includes(i) ? [today] : [])
    }
    console.log(values)
    return values;
}

async function readSpreadsheetsData(sheets, sheets_id, sheets_name, range) {
    return await new Promise((resolve, reject) => {
        sheets.spreadsheets.values.get({
            spreadsheetId: sheets_id,
            range: `${sheets_name}!${range}`,
            majorDimension: "COLUMNS",
        }, (err, res) => {
            const rows = res.data.values;
            resolve(rows);
            // if (rows.length) {
            //     resolve(rows);
            // } else {
            //     reject('The API returned an error: ' + err)
            // }
        });
    })
}

/**
 * Usable
 * @version v4
 * @param listUserCf
 * @returns {Promise<void>}
 */
async function modifySpreadsheet(listUserCf) {
    const {spreadsheets: {sheets_id, sheets_name, range}} = require('../resources/config.json');
    const mapID = require('../resources/userMapID.json');
    const peopleCount = 39;

    await callAPI((auth) => {
        const sheets = google.sheets({version: 'v4', auth});

        //read from Sheets first to ignore existed value
        readSpreadsheetsData(sheets, sheets_id, sheets_name, range).then(allUser => {
            // remap user
            let idCf = listUserCf.map((e) => mapID[e])
            let newCf = null

            let notCfYetInSheet = []
            if (allUser !== undefined) { //null check
                console.log(allUser[0]);
                for (const [index, value] of allUser[0].entries()) {
                    if (value === "") {
                        notCfYetInSheet.push(index)
                    }
                }
                console.log(notCfYetInSheet);

                // find the intersection between 2 array: @idCf and @notCfYetInSheet
                newCf = idCf.filter(x => notCfYetInSheet.includes(x));
            } else {
                newCf = idCf
            }
            let values = convertUserCfToWriteableTime(newCf, peopleCount);

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
        }).catch(error => console.log(error));
    })
}


module.exports = {modifySpreadsheet};