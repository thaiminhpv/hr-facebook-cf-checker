const {GoogleSpreadsheet} = require('google-spreadsheet');
const {promisify} = require('util');

const creds = require('./client-secret.json');

async function accessGoogleSpreadsheet() {
    const doc = await new GoogleSpreadsheet('1eWVXODuj6-hcppcancwgqw5yuyrbxqLzR4RhoZZ7xBE');
    console.log('1')
    await doc.useServiceAccountAuth(creds);
    console.log('2')
    const info = await doc.getInfo();
    console.log(info)
    const sheet = info.worksheets[0]
    console.log(`Title: ${sheet.title}, Row: ${sheet.rowCount}`)
}

accessGoogleSpreadsheet().then(() => {
    console.log('Done!')
})