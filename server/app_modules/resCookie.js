const CryptoJS = require("crypto-js");

const resCookie = {
    encrypt: (username, password) => {
        return CryptoJS.AES.encrypt(`${username} ${password}`, "SDxftyd2L").toString();
    },
    decrypt: (cookie) => {
        return CryptoJS.AES.decrypt(cookie, "SDxftyd2L").toString(CryptoJS.enc.Utf8);
    }
}

module.exports = resCookie;