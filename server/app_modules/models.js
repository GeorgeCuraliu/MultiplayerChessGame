const CryptoJS = require('crypto-js');
const { Sequelize } = require('sequelize');


const models = {
    users: {
        id:{
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            unique: true,
            primaryKey: true
        },
        username: {
            type: Sequelize.DataTypes.STRING,
            unique: true
        },
        password: {
            type: Sequelize.DataTypes.STRING,
            set(val){
                if(!val){throw new Error("No password provided")}
                this.setDataValue("password", CryptoJS.AES.encrypt(val, val).toString())
            }
        },
        inMatch: {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false
        },
        points:{
            type: Sequelize.DataTypes.NUMBER,
            defaultValue: 0
        },
        wonMatches:{
            type: Sequelize.DataTypes.NUMBER,
            defaultValue: 0
        }
    },
    matches: {
        id:{
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            unique: true,
            primaryKey: true
        },
        player1: {
            type: Sequelize.DataTypes.UUID,
            allowNull:false
        },
        player2: {
            type: Sequelize.DataTypes.UUID,
            allowNull:false
        },
        status: {
            type: Sequelize.DataTypes.STRING,//ongoing / ended
            allowNull: false
        },
        winner: {
            type: Sequelize.DataTypes.BOOLEAN,//false for player1, true for player2
            allowNull: true
        }
    }
}

module.exports = models;