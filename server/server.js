const express = require("express");
const cors = require("cors");
const Sequelize = require("sequelize");
const expressWs = require("express-ws");//ws
const CryptoJS = require(`crypto-js`)//aes
const dotenv = require('dotenv');//.env
const bodyParser = require("body-parser");//parse incoming requests`s body
const cookieParser = require("cookie-parser");//read the cookies set trought body-parser
const cls = require('cls-hooked');//auto transactions

//ADD CLS TO SEQUELIZE
const namespace = cls.createNamespace('my-very-own-namespace');
Sequelize.useCLS(namespace);

//MODULES
const models = require('./app_modules/models');//models for sequelize
const associations = require("./app_modules/associations");//create associations for models
const resCookie = require("./app_modules/resCookie");

//INSTANCE OF SEQUELIZE
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./db.db",
    logging: false,
    freeTableName: true
});

dotenv.config();
const port = process.env.PORT;

const corsOBJ = {
  'Access-Control-Allow-Origin': 'http://192.168.0.151:3000',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': [
    'Content-Type',
    'Authorization'
  ]
}

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
const expressWsInstance = expressWs(app);
const ws = expressWsInstance.getWss();
app.use(cors(corsOBJ));


app.post("/login", async (req, res) => {
    console.log(req.cookies.credentials);

    try{

      const users = await sequelize.define(`Users`, models.users);
      const user = await users.findOne({where: {username: req.body.username}});

      if(user && CryptoJS.AES.decrypt(user.dataValues.password, req.body.password) == req.body.password){
        console.log("good");
      }

    }catch{
      console.log('boom');
    }

});

app.post("/createAcc",cors(corsOBJ), async (req, res) => {

    try {
        await sequelize.transaction(async(t) => {
            console.log(req.body);
            const users = await sequelize.define("Users", models.users);
      
            try {
              await users.sync();
              await users.create({
                username: req.body.username,
                password: req.body.password
              });
              
              res.cookie("credentials", JSON.stringify(resCookie.encrypt(req.body.username, req.body.password)), {httpOnly: true});

              return res.sendStatus(200).send();
            } catch (error) {
              console.error("Error creating user");

              if(error.name === "SequelizeUniqueConstraintError"){
                return res.status(400).json({ data: "Username already used" });
              }else{
                throw error;
              }
              
            }
        });
    } catch (err) {
        console.error("An critical error occurred at /createAcc");
        console.log(err);
        return res.sendStatus(500);
    }


});





app.listen(port, () => {
    console.log(`Chess app is online at port ${port}`);
});
