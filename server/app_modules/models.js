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
            primaryKey: true,
            allowNull: false
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
            allowNull: false,
            defaultValue: "ongoing"
        },
        winner: {
            type: Sequelize.DataTypes.BOOLEAN,//false for player1, true for player2
            allowNull: true
        },
        turn: {
            type: Sequelize.DataTypes.UUID,
            allowNull: true
        },

        //these will represent the pieces location(or 0 if it was captured)

        //WHITE -- second line
        WR1: {//white rook 1
            type: Sequelize.DataTypes.STRING,
            defaultValue: "a1",
            allowNull: false
        },
        WR2: {//white rook 2
            type: Sequelize.DataTypes.STRING,
            defaultValue: "h1",
            allowNull: false
        },
        WK1: {//white knight 1
            type: Sequelize.DataTypes.STRING,
            defaultValue: "b1",
            allowNull: false
        },
        WK2: {//white knight 2
            type: Sequelize.DataTypes.STRING,
            defaultValue: "g1",
            allowNull: false
        },
        WB1: {//white bishop 1
            type: Sequelize.DataTypes.STRING,
            defaultValue: "c1",
            allowNull: false
        },
        WB2: {//white bishop 2
            type: Sequelize.DataTypes.STRING,
            defaultValue: "f1",
            allowNull: false
        },
        WQ: {//white queen
            type: Sequelize.DataTypes.STRING,
            defaultValue: "d1",
            allowNull: false
        },
        WK: {//white king
            type: Sequelize.DataTypes.STRING,
            defaultValue: "e1",
            allowNull: false
        },

        //WHITE PAWNS -- first line
        WP1: {
            type: Sequelize.DataTypes.STRING,
            defaultValue: "a2",
            allowNull: false
        },
        WP2: {
            type: Sequelize.DataTypes.STRING,
            defaultValue: "b2",
            allowNull: false
        },
        WP3: {
            type: Sequelize.DataTypes.STRING,
            defaultValue: "c2",
            allowNull: false
        },
        WP4: {
            type: Sequelize.DataTypes.STRING,
            defaultValue: "d2",
            allowNull: false
        },
        WP5: {
            type: Sequelize.DataTypes.STRING,
            defaultValue: "e2",
            allowNull: false
        },
        WP6: {
            type: Sequelize.DataTypes.STRING,
            defaultValue: "f2",
            allowNull: false
        },
        WP7: {
            type: Sequelize.DataTypes.STRING,
            defaultValue: "g2",
            allowNull: false
        },
        WP8: {
            type: Sequelize.DataTypes.STRING,
            defaultValue: "h2",
            allowNull: false
        },


        //BLACK --second line
        BR1: {//black rook 1
            type: Sequelize.DataTypes.STRING,
            defaultValue: "a8",
            allowNull: false
        },
        BR2: {//black rook 2
            type: Sequelize.DataTypes.STRING,
            defaultValue: "h8",
            allowNull: false
        },
        BK1: {//black knight 1
            type: Sequelize.DataTypes.STRING,
            defaultValue: "b8",
            allowNull: false
        },
        BK2: {//black knight 2
            type: Sequelize.DataTypes.STRING,
            defaultValue: "g8",
            allowNull: false
        },
        BB1: {//black bishop 1
            type: Sequelize.DataTypes.STRING,
            defaultValue: "c8",
            allowNull: false
        },
        BB2: {//black bishop 2
            type: Sequelize.DataTypes.STRING,
            defaultValue: "f8",
            allowNull: false
        },
        BQ: {//black queen
            type: Sequelize.DataTypes.STRING,
            defaultValue: "d8",
            allowNull: false
        },
        BK: {//black king
            type: Sequelize.DataTypes.STRING,
            defaultValue: "e8",
            allowNull: false
        },

        //BLACK PAWNS -- first line
        BP1: {
            type: Sequelize.DataTypes.STRING,
            defaultValue: "a7",
            allowNull: false
        },
        BP2: {
            type: Sequelize.DataTypes.STRING,
            defaultValue: "b7",
            allowNull: false
        },
        BP3: {
            type: Sequelize.DataTypes.STRING,
            defaultValue: "c7",
            allowNull: false
        },
        BP4: {
            type: Sequelize.DataTypes.STRING,
            defaultValue: "d7",
            allowNull: false
        },
        BP5: {
            type: Sequelize.DataTypes.STRING,
            defaultValue: "e7",
            allowNull: false
        },
        BP6: {
            type: Sequelize.DataTypes.STRING,
            defaultValue: "f7",
            allowNull: false
        },
        BP7: {
            type: Sequelize.DataTypes.STRING,
            defaultValue: "g7",
            allowNull: false
        },
        BP8: {
            type: Sequelize.DataTypes.STRING,
            defaultValue: "h7",
            allowNull: false
        },
    },
    matchHistory:{//MH_${match_id}
        id:{
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        pieceMoved:{
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        movedTo:{
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        }
    }
}

module.exports = models;