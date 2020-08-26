function get(URL, data, mode) {
    return fetch(`${URL}?mode=${mode}&data=${JSON.stringify(data)}`)
}

function atClient() {
    let shareLink = 'https://m.facebook.com/browse/shares?id='
    let postID = window.location.href.match(/\/(\d+)/)[1]
    window.open(shareLink + postID, '__blank')
}

function atPopUp() {
    let url = 'http://localhost:5000'
// let url = 'https://facebook-check-c-1597716165009.web.app'
    const route = '/facebook-endpoint'
    const mode = 'share'
    const link = url + route
    let userShare = [...document.querySelectorAll('._4mo')].map(e => e.innerText)
    get(link, userShare, mode).then(response => {
        console.log(response)
    }).catch(error => console.error(error))
}
