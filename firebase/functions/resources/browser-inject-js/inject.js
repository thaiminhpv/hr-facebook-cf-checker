function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


//TODO: get like, share check
async function openAllMinimized() {
    //TODO: view more comments until there are none left, filter -> all comment
    try {
        // delete Other post
        document.getElementsByClassName('d2edcug0 oh7imozk abvwweq7 ejjq64ki')[1].innerHTML = '';
        // Get All comment instead of relevant
        // open dropbox
        [...document.querySelectorAll('.oajrlxb2.g5ia77u1.qu0x051f.esr5mh6w.e9989ue4.r7d6kgcz.rq0escxv.nhd2j8a9.nc684nl6.p7hjln8o.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.jb3vyjys.rz4wbd8a.qt6c0cv9.a8nywdso.i1ao9s8h.esuyzwwr.f1sip0of.lzcic4wl.l9j0dhe7.abiwlrkh.p8dawk7l[role="button"]')].filter(e => e.innerText === "Most Relevant﻿")[0].click()
        await sleep(2000)
        //click 'All comments'
        document.getElementsByClassName('oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 j83agx80 p7hjln8o kvgmc6g5 oi9244e8 oygrvhab h676nmdw pybr56ya dflh9lhu f10w8fjw scb9dxdr i1ao9s8h esuyzwwr f1sip0of lzcic4wl l9j0dhe7 abiwlrkh p8dawk7l bp9cbjyn dwo3fsh8 btwxx1t3 pfnyh3mw du4w35lb')[2].click();
        //loop until open all hidden comments
    } catch (e) {
        console.log(e)
    }
    while ([...document.getElementsByClassName('oajrlxb2 bp9cbjyn g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 pq6dq46d mg4g778l btwxx1t3 g5gj957u p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys p8fzw8mz qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb lzcic4wl abiwlrkh p8dawk7l buofh1pr')]
        .filter((e) => !e.innerText.contains('Hide')).length !== 0) {
        [...document.getElementsByClassName('oajrlxb2 bp9cbjyn g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 pq6dq46d mg4g778l btwxx1t3 g5gj957u p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys p8fzw8mz qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb lzcic4wl abiwlrkh p8dawk7l buofh1pr')]
            .filter((e) => !e.innerText.contains('Hide')).forEach((e) => e.click())
        console.log("expanding...")
        // eslint-disable-next-line no-await-in-loop
        await sleep(4000)
    }
}

function getAllCfUser() {
    return [...new Set([...document.getElementsByClassName('oi732d6d ik7dh3pa d2edcug0 qv66sw1b c1et5uql a8c37x1j hop8lmos enqfppq2 e9vueds3 j5wam9gi lrazzd5p oo9gr5id')]
        .map((e) => e.innerText))];
}

function get(URL, data) {
    return fetch(`${URL}?data=${JSON.stringify(data)}`)
}

async function post(URL, data) {
    console.log(JSON.stringify(data))
    return await fetch(URL, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

let url = 'http://localhost:5000'
// let url = 'https://facebook-check-c-1597716165009.web.app'
const route = '/facebook-endpoint'
const link = url + route

async function run() {
    await openAllMinimized();
    console.log("all opened, sending data...")
    const allCfUser = getAllCfUser();
    console.log(allCfUser);
    return get(link, allCfUser).then((response => {
        console.log('response: ', response);
        return response;
    }))
}

run().then((response) => console.log('Done!')).catch(error => console.log('error: ', error));
console.log(`Go to ${url}/link-auth to authentication`)