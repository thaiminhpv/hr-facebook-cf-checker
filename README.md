# Facebook cf checker automation for Human Resource

This is a simple script to automate the process of checking the Facebook cf checker for the Human Resource department.

First, tampermonkey or chrome-extension will inject script into the page.
Then, the script will read the data from the page and send it to the server.
Server will process the data and call Google API to tick results into Google Spreadsheet.
Server's config can be accessed from /config ([./firebase/functions/views/config.ejs](./firebase/functions/views/config.ejs))

- Google API
- Deploy to Firebase
- injector (use tampermonkey or chrome-extension)
## NodeJS


# Tampermonkey (injector)

- auto fetch inject script from /injection/inject/ and exec

```javascript
// ==UserScript==
// @name         Facebook check cf shortcut launch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       thaiminhpv
// @match        https://*.facebook.com/*
// @grant        none
// ==/UserScript==

(function() {
    let keysPressed = {};
    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
        if (keysPressed['Control'] && event.key == '`') {
            run();
        }
    });

    document.addEventListener('keyup', (event) => {
        delete keysPressed[event.key];
    });

    function run(){
        function get(url) {return new Promise((resolve, reject) => {let xmlhttp = new XMLHttpRequest();xmlhttp.onreadystatechange = function () {if (xmlhttp.readyState === XMLHttpRequest.DONE) {if (xmlhttp.status === 200) {resolve(xmlhttp.responseText);} else {reject(new Error("oops, something went wrong!"));}}};xmlhttp.open("GET", url, true);xmlhttp.send();})}choice = parseInt(prompt(`Nhập lựa chọn của bạn:\n1: like - 2:cmt - 3:share`));fileName = choice === 1 ? 'get-like.js' : choice === 2 ? 'get-cmt.js' : 'get-share.js';get("https://facebook-check-c-1597716165009.web.app/injection/inject/" + fileName).then(code => {console.log(code);eval(code);}).catch(error => console.log(error));
    }
})();
```
# Spreadsheet example

https://docs.google.com/spreadsheets/d/1kf8jeovlOEQUTkGJy1BYAj55sbpqEarlu4NU5bTEDVE/edit#gid=0
