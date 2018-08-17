
function parse(url) {
    let hash = url.slice(url.indexOf('#') + 1).split('&');

    let ret = {};

    for (let str of hash) {
        let keyVal = str.split('=');

        if (keyVal.length < 2) {
            continue;
        }

        ret[keyVal[0]] = keyVal[1];
    }

    return ret;
}

function stringify(hashObj) {

    let str = '#';

    for (let key in hashObj) {
        str += '&' + key + '=' + hashObj[key];
    }

    return str.replace('#&','#');
}

module.exports = {
    parse: parse,
    stringify: stringify
}