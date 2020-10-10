/*
 * FIXME: problems: performance & speed decreased
 *  solution: divide into 2 file share - 2 options to choose
 */

function get(URL, data, mode) {
    return fetch(`${URL}?mode=${mode}&data=${JSON.stringify(data)}`)
}

async function openAllMinimized() {
    console.log("expanding...");
    await sleep(2000);
    document.getElementsByClassName('d2edcug0 hpfvmrgz qv66sw1b c1et5uql rrkovp55 a8c37x1j keod5gw0 nxhoafnm aigsh9s9 d3f4x2em fe6kdd0r mau55g9w c8b282yb iv3no6db jq4qci2q a3bd9o3v knj5qynh m9osqain')[2].click();
    await sleep(2000);
    let a = document.getElementsByClassName('q5bimw55 rpm2j7zs k7i0oixp gvuykj2m j83agx80 cbu4d94t ni8dbmo4 eg9m0zos l9j0dhe7 du4w35lb ofs802cu pohlnb88 dkue75c7 mb9wzai9 d8ncny3e buofh1pr g5gj957u tgvbjcpo l56l04vs r57mb794 kh7kg01d c3g1iek1 k4xni2cv')[1];
    console.log('running...');

    const delay = parseInt(prompt("delay?", 300));
    for (let i = 0; i < delay; i++) {
        await sleep(1000);
        a.scrollTo(0, 99999999);
        console.log('expanding...');
    }
}

function getAllSharedUser() {
    return [...new Set([...document.getElementsByClassName('gmql0nx0 l94mrbxd p1ri9a11 lzcic4wl aahdfvyu hzawbc8m')].map((e) => e.innerText))];
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

    get(link, userShare, mode).then(response => {
        console.log(response)
        return response
    }).catch(error => console.error(error))
}

atPopUp().then(response => console.log(response)).catch(error => console.error(error))
