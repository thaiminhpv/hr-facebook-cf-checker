let shareLink = 'https://m.facebook.com/browse/shares?id='
let postID = window.location.href.match(/\/(\d+)/)[1]
window.open(shareLink + postID, '__blank')