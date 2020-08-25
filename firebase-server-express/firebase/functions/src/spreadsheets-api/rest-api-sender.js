const {getAuth} = require('./OAuth2-sheet');
const {google} = require('googleapis');
const {setToken} = require('../database/tokenDAO');

/**
 * @source https://stackoverflow.com/a/1050782/11806050
 * @param hours
 * @returns {Date}
 */
Date.prototype.addHours = function (hours) {
    this.setTime(this.getTime() + (hours * 60 * 60 * 1000));
    return this;
}

/**
 * Get today
 * @returns {string}
 */
function getDate() {
    let date = (new Date()).addHours(7) //+ 7 hours because server's time is US based
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes() + 1}:00`
}

/**
 * miêu tả thuật toán: từ @array ta đem so sánh với Map
 * -> chỉ lấy ra một cái array chứa index của những ô cần điền ngày giờ
 * @param array
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

function readSpreadsheetsData(sheets, sheets_id, sheets_name, range) {
    return new Promise((resolve, reject) => {
        sheets.spreadsheets.values.get({
            spreadsheetId: sheets_id,
            range: `${sheets_name}!${range}`,
            majorDimension: "COLUMNS",
        }, (err, res) => {
            if (err) return reject(err)
            const rows = res.data.values;
            return resolve(rows);
        });
    })
}


function updateSpreadsheetsData(sheets, main_spreadsheets, values) {
    return sheets.spreadsheets.values.update({
        spreadsheetId: main_spreadsheets.sheets_id,
        range: `${main_spreadsheets.sheets_name}!${main_spreadsheets.range}`,
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
        return rows
    })
}

/**
 * Usable
 * @version v4
 * @param listUserCf
 * @returns {Promise<*>}
 */
function modifySpreadsheet(listUserCf) {
    const {main_spreadsheets, map_user_id} = require('../../resources/config.json');
    const peopleCount = 39;

    return getAuth((auth) => {
        const sheets = google.sheets({version: 'v4', auth});

        let queue = []
        // 1. get map
        queue.push(readSpreadsheetsData(sheets, map_user_id.sheets_id, map_user_id.sheets_name, map_user_id.range).then(facebookNameQueried => {
            //map
            let mapID = {}
            for (const [index, facebookName] of facebookNameQueried[0].entries()) {
                if (facebookName !== "") {
                    mapID[facebookName] = index
                }
            }
            console.log(mapID)
            return mapID
        }))
        // 2. read from Sheets first to ignore existed value
        queue.push(readSpreadsheetsData(sheets, main_spreadsheets.sheets_id, main_spreadsheets.sheets_name, main_spreadsheets.range))

        return Promise.all(queue)
            .then(([mapID, allUser]) => {
                // remap user from facebook name to id
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
                return updateSpreadsheetsData(sheets, main_spreadsheets, values);
            }).catch(error => {
                console.log('token timed out')
                if (error.message === 'No refresh token is set.')
                    return setToken(null).then(response => modifySpreadsheet(listUserCf))
                return error
            })
    })
}

module.exports = {modifySpreadsheet};