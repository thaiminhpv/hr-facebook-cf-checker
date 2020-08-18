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
get("path_to_inject.js").then(code => eval(code)).catch(error => console.log(error));