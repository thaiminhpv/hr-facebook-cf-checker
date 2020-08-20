const admin = require('firebase-admin')
admin.initializeApp();
const db = admin.firestore()

/*
 this collection has only 2 rows:
 row1: link auth
 row2: token - json
*/
const collectionName = 'authentication'

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0
}

async function queryCollection(collection) {
    const snapshot = await db.collection(collection).get()
    let queried = []
    await snapshot.forEach((doc) => {
        queried.push([doc.id, doc.data()])
    });
    let [link, token] = queried
    return [link, token]
}

function setLinkAuth(link) {
    console.log('setting link auth, link auth is: -----')
    console.log(link)
    return db.collection(collectionName).doc('linkAuth').set({
        link: link
    });
}

async function getLinkAuth() {
    console.log('getting link auth...')
    let [link, token] = await queryCollection(collectionName)
    console.log('link is: ')
    console.log(link)
    console.log('token is: ')
    console.log(token)
    if (isObjectEmpty(link[1])) {
        return 'https://www.google.com';
    } else {
        let unformattedLink = link[1].link
        return unformattedLink.slice(1, -1) //hot fix ""abc""
    }
}

function setToken(token) {
    console.log('setting token, token is: ---')
    console.log(token)
    return db.collection(collectionName).doc('token').set({token: JSON.stringify(token)});
}

async function getToken() {
    console.log('getting token, token is: ---')
    let [link, token] = await queryCollection(collectionName)
    console.log('link is: ')
    console.log(link)
    console.log('token is: ')
    console.log(token)
    if (isObjectEmpty(token[1])) {
        return null;
    } else {
        return JSON.parse(token[1].token) // this will be JSON.parse() later one more time -> this is hot fix
    }
}


module.exports = {setLinkAuth, getLinkAuth, setToken, getToken}