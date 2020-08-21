const { callAPI } = require('./OAuth2-sheet');
const { google } = require('googleapis');

/**
 * @source https://stackoverflow.com/a/1050782/11806050
 * @param hours
 * @returns {Date}
 */
Date.prototype.addHours = function(hours) {
    this.setTime(this.getTime() + (hours*60*60*1000));
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

async function readSpreadsheetsData(sheets, sheets_id, sheets_name, range) {
    return await new Promise((resolve, reject) => {
        sheets.spreadsheets.values.get({
            spreadsheetId: sheets_id,
            range: `${sheets_name}!${range}`,
            majorDimension: "COLUMNS",
        }, (err, res) => {
            if (err) return reject(new Error('The API returned an error: ' + err))
            const rows = res.data.values;
            return resolve(rows);
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
    const { spreadsheets: { sheets_id, sheets_name, range }, map_user_id } = require('../../resources/config.json');
    const peopleCount = 39;

    return await callAPI((auth) => {
        const sheets = google.sheets({ version: 'v4', auth });

        //map
        let mapID = {}
        readSpreadsheetsData(sheets, sheets_id, map_user_id.sheets_name, map_user_id.range).then(facebookNameQueried => {
            for (const [index, facebookName] of facebookNameQueried[0].entries()) {
                if (facebookName !== "") {
                    mapID[facebookName] = index
                }
            }
            console.log(mapID)

            //read from Sheets first to ignore existed value
            return readSpreadsheetsData(sheets, sheets_id, sheets_name, range).then(allUser => {
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

                return sheets.spreadsheets.values.update({
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
                    return rows
                })
            })
        }).catch(error => console.log(error));
    })
}


module.exports = { modifySpreadsheet };