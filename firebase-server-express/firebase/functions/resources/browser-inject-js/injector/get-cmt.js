function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function countFrequency(arr) {
    let counts = {};
    for (let i = 0; i < arr.length; i++) {
        let num = arr[i];
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    }
    let out = []
    for (const countsKey in counts) {
        out.push([countsKey, counts[countsKey]])
    }
    return out;
}

async function openAllMinimized() {
    //loop until open all hidden comments
    while (document.getElementsByClassName('_108_')[0] !== undefined) {
        document.getElementsByClassName('_108_')[0].click()
        console.log("expanding...")
        await sleep(3000);
    }
}

function getAllCfUser() {
    return countFrequency([...document.getElementsByClassName('_2b05')].map((e) => e.innerText))
}

function get(URL, data, mode) {
    return fetch(`${URL}?mode=${mode}&data=${JSON.stringify(data)}`)
}

// let url = 'http://localhost:5000'
let url = 'https://facebook-check-c-1597716165009.web.app'
const route = '/facebook-endpoint'
const link = url + route
const mode = 'cmt'

async function run() {
    await openAllMinimized();
    console.log("all opened, sending data...")
    const allCfUser = getAllCfUser();
    console.log(allCfUser);
    return get(link, allCfUser, mode).then((response => {
        console.log('response: ', response);
        return response;
    }))
}

run().then((response) => console.log('Done!')).catch(error => console.log('error: ', error));
console.log(`Go to ${url}/link-auth to authentication`)
