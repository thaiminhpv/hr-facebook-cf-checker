const fs = require('fs');

/**
 * @param path
 * @return {Promise}
 */
function readRawFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err === null) {
                resolve(data)
            } else {
                reject(err)
            }
        })
    })
}

function changeConfigFile({main_sheet_id, main_sheet_name, main_range, map_sheet_id, map_sheet_name, map_range, map_people_count}) {
    let configFile = require('../../resources/config.json');
    //note: we don't need API_key anymore
    configFile.main_spreadsheets = {
        sheets_id: main_sheet_id,
        sheets_name: main_sheet_name,
        range: main_range
    }
    configFile.map_user_id = {
        sheets_id: map_sheet_id,
        sheets_name: map_sheet_name,
        range: map_range,
        people_count: map_people_count
    }
    console.log(configFile)
    fs.writeFileSync('./resources/config.json', JSON.stringify(configFile));
}

module.exports = {changeConfigFile, readRawFile}