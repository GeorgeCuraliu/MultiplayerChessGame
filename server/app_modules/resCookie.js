const CryptoJS = require("crypto-js");

const resCookie = {
    encrypt: (username, password) => {
        return CryptoJS.AES.encrypt(`${username} ${password}`, "SDxftyd2L").toString();
    }
}

module.exports = resCookie;