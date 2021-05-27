(() => {
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function get(URL, data, mode) {
        return fetch(`${URL}?mode=${mode}&data=${JSON.stringify(data)}`)
    }

    function post(URL, data, mode) {
        return fetch(URL, {
            method: 'POST',
            body: {
                data: data,
                mode: mode
            }
        })
    }

    async function openMinimized() {
        while ([...document.getElementsByClassName('touchable primary')].filter((e) => e.innerText === "See More…")[0] !== undefined) {
            [...document.getElementsByClassName('touchable primary')].filter((e) => e.innerText === "See More…")[0].click();
            console.log("expanding...")
            // eslint-disable-next-line no-await-in-loop
            await sleep(3000);
        }
    }

    function atClient() {
        let shareLink = 'https://m.facebook.com/ufi/reaction/profile/browser/?ft_ent_identifier='
        let currentURL = window.location.href
        let postID;
        if (currentURL.match(/story_fbid=(\d+)/)) {
            postID = currentURL.match(/story_fbid=(\d+)/)[1]
        } else {
            postID = currentURL.match(/\/(\d+)/)[1];
        }

        window.open(shareLink + postID, '__blank')
    }

    async function atPopUp() {
        // let url = 'http://localhost:5000'
        let url = 'https://facebook-check-c-1597716165009.web.app'
        const route = '/facebook-endpoint'
        const mode = 'react'
        const link = url + route

        await openMinimized()
        console.log("all opened, sending data...")
        let userShare = [...document.querySelectorAll('._4mo')].map(e => e.innerText)
        console.log(userShare)
        get(link, userShare, mode).then(response => {
            console.log(response.json())
            return response
        }).catch(error => console.error(error))
    }

    // eslint-disable-next-line no-alert
    if (parseInt(prompt('Origin or Pop-up? 1:Origin 2:Pop-up')) === 1) {
        atClient()
    } else {
        atPopUp().then(response => console.log(response)).catch(error => console.error(error))
    }
})()