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
const { error } = require("console");
const { resolveAny } = require("dns/promises");

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
  origin: process.env.ORIGIN,
  credentials: true
}

const app = express();
const expressWsInstance = expressWs(app);
const ws = expressWsInstance.getWss();


app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOBJ));

const checkCredentials = async (username, password) => {
  return new Promise(async(resolve, reject) => {
    try{
      
      const users = await sequelize.define(`Users`, models.users);
      const user = await users.findOne({where: {username: username}});

      if(user && CryptoJS.AES.decrypt(user.dataValues.password, password).toString(CryptoJS.enc.Utf8) == password){
        resolve({username: username, points: user.dataValues.points});
      }else{
        resolve(false);
      }

    }catch(err){
      console.log(err)
      console.error('Critical error at checkCredentials');
      reject();
    }
  })
  
}

app.post("/login", async (req, res) => {
    console.log(req.cookies.credentials + " login");

    try{

      let validity;
      let password;

      if(!req?.body?.username){
        const data = resCookie.decrypt(req.cookies.credentials);
        const values = data.split(` `);
        console.log(data+" data");
        console.log(values);
        validity = await checkCredentials(values[0], values[1]);
        password = values[1];
      }else if(req?.body?.username){
        validity = await checkCredentials(req.body.username, req.body.password);
        password = req.body.password;
      }
      
      

      if(validity){
        console.log(validity.username, password + " validity");
        console.log(`user ${validity.username} just logged`);
        res.cookie("credentials", JSON.stringify(resCookie.encrypt(validity.username, password)), {httpOnly: true});
        return res.status(200).json({...validity});
      }else{
        return res.status(401).json({data: "Invalid credentials"})
      }

    }catch(err){
      console.log(err);
      console.log('Critical error at /login');
      return res.sendStatus(500);
    }

});

app.post("/createAcc", async (req, res) => {
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

              return res.status(201).json({username: req.body.username, points: 0});
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