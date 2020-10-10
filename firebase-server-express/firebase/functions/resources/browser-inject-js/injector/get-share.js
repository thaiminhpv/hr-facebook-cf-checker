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

function get(URL, data, mode) {
    return fetch(`${URL}?mode=${mode}&data=${JSON.stringify(data)}`)
}

async function openAllMinimized(){
    console.log("expanding...");
    //TODO: paste merge code here
    return sleep(parseInt(prompt("delay?", 300)) * 1000);
}

function getAllSharedUser() {
    return countFrequency([...document/*TODO: insert class count here*/].map((e) => e.innerText))
}

async function atPopUp() {
    // let url = 'http://localhost:5000'
    let url = 'https://facebook-check-c-1597716165009.web.app'
    const route = '/facebook-endpoint'
    const mode = 'share'
    const link = url + route
    await openAllMinimized();
    console.log("all opened, sending data...");

    let userShare = getAllSharedUser();
    console.log(userShare);

    //TODO: get the key only

    get(link, userShare, mode).then(response => {
        console.log(response)
        return response
    }).catch(error => console.error(error))
}

atPopUp().then(response => console.log(response)).catch(error => console.error(error))
