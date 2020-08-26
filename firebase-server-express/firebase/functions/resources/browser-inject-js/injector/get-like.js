let shareLink = 'https://m.facebook.com/ufi/reaction/profile/browser/?ft_ent_identifier='
let postID = window.location.href.match(/\/(\d+)/)[1]
window.open(shareLink + postID, '__blank')