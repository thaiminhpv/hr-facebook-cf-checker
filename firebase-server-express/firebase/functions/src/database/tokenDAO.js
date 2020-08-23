const admin = require('firebase-admin')
admin.initializeApp();
const db = admin.firestore()

/*
 'authentication' collection has only 2 rows:
 row1: linkAuth - string
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
    console.log('setting link auth')
    console.log(link)
    return db.collection(collectionName).doc('linkAuth').set({
        link: link
    });
}

/**
 *
 * @returns {Promise<string>}
 */
async function getLinkAuth() {
    console.log('getting link auth...')
    let [link, token] = await queryCollection(collectionName)
    if (link === undefined || isObjectEmpty(link[1])) {
        return Promise.reject(new Error('Link auth is empty'))
    } else {
        return link[1].link.slice(1, -1) //hot fix ""abc""
    }
}

function setToken(token) {
    console.log('setting token')
    console.log(token)
    return db.collection(collectionName).doc('token').set({token: JSON.stringify(token)});
}

async function getToken() {
    console.log('getting token')
    let [link, token] = await queryCollection(collectionName)
    if (token === undefined || isObjectEmpty(token[1])) {
        return null;
    } else {
        return JSON.parse(token[1].token) // this will be JSON.parse() later one more time -> this is hot fix
    }
}


module.exports = {setLinkAuth, getLinkAuth, setToken, getToken}