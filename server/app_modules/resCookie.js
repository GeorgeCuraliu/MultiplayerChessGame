const CryptoJS = require("crypto-js");

const resCookie = {
    encrypt: (username, password) => {
        const encryption = CryptoJS.AES.encrypt(`${username} ${password}`, "SDxftyd2L").toString();
        return encryption;
    },
    decrypt: (cookie) => {
        const value = cookie.replace(/\"/g, "");
        const chips = CryptoJS.AES.decrypt(value, "SDxftyd2L");
        const response = chips.toString(CryptoJS.enc.Utf8);
        return response;
    }
}

module.exports = resCookie;