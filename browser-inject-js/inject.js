function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function openAllMinimized() {
    for (let i = 0; i < 2; i++) {
        //just simply loop 2 times
        [...document.getElementsByClassName('oajrlxb2 bp9cbjyn g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 pq6dq46d mg4g778l btwxx1t3 g5gj957u p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys p8fzw8mz qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb lzcic4wl abiwlrkh p8dawk7l buofh1pr')]
            .filter((e) => !e.innerText.contains('Hide')).forEach((e) => e.click())
        await sleep(4000)
    }
}

function getAllCfUser() {
    return [...new Set([...document.getElementsByClassName('oi732d6d ik7dh3pa d2edcug0 qv66sw1b c1et5uql a8c37x1j hop8lmos enqfppq2 e9vueds3 j5wam9gi lrazzd5p oo9gr5id')]
        .map((e) => e.innerText))];
}

async function get(URL, data) {
    return await fetch(`${URL}?data=${JSON.stringify(data)}`)
}

async function post(URL, data) {
    console.log(JSON.stringify(data))
    return await fetch(URL, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

const url = 'http://localhost:3000'
const route = '/facebook-endpoint'
const link = url + route

async function run() {
    await openAllMinimized()
    const allCfUser = getAllCfUser();
    console.log(allCfUser)
    // TODO: Post data to server here (PostAPI to GoogleSpreadsheet) Firebase first
    // post data to localhost when testing firebase
    get(link, allCfUser)
        .then((response => {
            console.log('response: ', response)
        }))
        .catch(error => console.log('error: ', error));
}

run().then((response) => console.log('Done!'))