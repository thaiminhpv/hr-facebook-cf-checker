async function get(url) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === XMLHttpRequest.DONE) {
            if (xmlhttp.status === 200) {
                return xmlhttp.responseText;
            } else {
                throw "oops, something went wrong!";
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
// TODO: Publish - set repository to public
get("https://raw.githubusercontent.com/thaiminhpv/hr-facebook-cf-checker/master/browser-inject-js/inject.js").then(code => eval(code)).catch(error => console.log(error));