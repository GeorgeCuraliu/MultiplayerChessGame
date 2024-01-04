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

const matchQuene = {};
const activePlayers = {};

const checkCookie = (cookie) => {
  return new Promise(async(resolve, reject) => {
    try{
      const data = resCookie.decrypt(cookie);
      const values = data.split(` `);
      console.log(data+" data");
      console.log(values);
      validity = await checkCredentials(values[0], values[1]);
      resolve({validity:validity, password: values[1]});//i have to use another key for password, because the object inside validity will be returned to user
    }catch{
      reject();
    }
  })
}

const checkCredentials = async (username, password) => {
  return new Promise(async(resolve, reject) => {
    try{
      
      //will define and associate users and macthes
      const users = await sequelize.define(`Users`, models.users);
      const user = await users.findOne({where: {username: username}});

      if(user && CryptoJS.AES.decrypt(user.dataValues.password, password).toString(CryptoJS.enc.Utf8) == password){
        resolve({username: username, points: user.dataValues.points, inMatch: user.dataValues.inMatch});
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

app.ws(`/matchQuene`, (ws, req) => {//used just for quening purposes and preparing a match data
  ws.on(`message`, async message => {

    const response = await checkCookie(req.cookies.credentials)
    let validity = response.validity;
    
    if(validity){
      if(matchQuene[validity.username]){
        console.log(`player ${validity.username} deleted from quene`);
        delete matchQuene[validity.username];
      }else{
        if(Object.keys(matchQuene).length !== 0){

          const users = sequelize.define(`Users`, models.users);
          users.sync().then(async() => {
            try{
              sequelize.transaction(async(t) => {

                const opponent = Object.keys(matchQuene)[0];//in case that matchQuene updates with another users

                const userdata1 = await users.findOne({where:{username: opponent}});
                await userdata1.update({inMatch: true});
                await userdata1.save();
                
                const userdata2 = await users.findOne({where:{username: validity.username}});
                await userdata2.update({inMatch: true});
                await userdata2.save();

                //create the match and get the match id
                const matches = await sequelize.define(`Matches`, models.matches);
                await matches.sync();

                const match = await matches.create({player1: userdata1.dataValues.id, player2: userdata2.dataValues.id, turn: userdata1.dataValues.id});

                const MH = await sequelize.define(`MH_${match.dataValues.id}`, models.matchHistory);
                await MH.sync();

                ws.send(JSON.stringify({username: userdata1.dataValues.username, points: userdata1.dataValues.points}));
                matchQuene[opponent].send(JSON.stringify({username: userdata2.dataValues.username, points: userdata2.dataValues.points}));

                delete matchQuene[opponent];
             });
            }catch(err){
              console.log(err);
              console.error("critical error at matchmaking quene");
            }
          })
          
          matchQuene[Object.keys(matchQuene)[0]].send()
          console.log("starting match");
        }else{
          console.log(`player ${validity.username} is waiting in quene for a match`);
          matchQuene[validity.username] = ws;
        }
      }
    }
console.log(Object.keys(matchQuene));
  });
});

app.ws("/match", (ws, req) => {//no game logic is written on fron-end, so the server can alwasy check the information
  ws.on(`message`, async message => {

    const data = JSON.parse(message);

    //used to register the player in activePlayers obj
    if(data.type === `auth`){
      const response = await checkCookie(req.cookies.credentials);
      if(response.validity){

        activePlayers[response.validity.username] = ws;
        //ws.send(JSON.stringify({poss:"not"}));

      };
    };

    //used to show a user of possible moves for a selected piece
    //{type:"checkMove", piece:"piece(...WR1)"}
    if(data.type === `checkMove`){
      
    };

  })
})

app.post("/login", async (req, res) => {
    console.log(req.cookies.credentials + " login");

    try{

      let validity;
      let password;

      if(!req?.body?.username && req?.cookies?.credentials){
        const response = await checkCookie(req.cookies.credentials);
        validity = response.validity;
        password = response.password;
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