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
const gameLogic = require(`./app_modules/gameLogic`);

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
        resolve({username: username, points: user.dataValues.points, inMatch: user.dataValues.inMatch, id:user.dataValues.id});
      }else{
        resolve(false);
      }

    }catch(err){
      console.log(err);
      console.error('Critical error at checkCredentials');
      reject();
    }
  })
  
}

app.ws(`/matchQuene`, (ws, req) => {//used just for quening purposes and preparing a match data
  ws.on(`message`, async message => {

    const response = await checkCookie(req.cookies.credentials);
    let validity = response.validity;
    
    
    if(validity?.inMatch){//if the user is already active in a match
      console.log("user active in match");
      const matches = await sequelize.define(`Matches`, models.matches);
      await matches.sync();

      const match = await matches.findOne({where: {
        [Sequelize.Op.or]: [
          {player1: validity.id},
          {player2: validity.id}
        ],
        status:"ongoing"
      }});

      const users = await sequelize.define(`Users`, models.users);
      await users.sync();
      const player2 = await users.findOne({where:{id: validity.id === match.dataValues.player1 ? match.dataValues.player2 : match.dataValues.player1}});
      ws.send(JSON.stringify({username: player2.dataValues.username, points: player2.dataValues.points, matchID: match.dataValues.id}))

    }else if(validity){//if the user is not active in a match
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

                const match = await matches.create({player1: userdata1.dataValues.id, player2: userdata2.dataValues.id});

                const MH = await sequelize.define(`MH_${match.dataValues.id}`, models.matchHistory);
                await MH.sync();

                ws.send(JSON.stringify({username: userdata1.dataValues.username, points: userdata1.dataValues.points, matchID: match.dataValues.id}));
                matchQuene[opponent].send(JSON.stringify({username: userdata2.dataValues.username, points: userdata2.dataValues.points, matchID: match.dataValues.id}));

                delete matchQuene[opponent];
             });
            }catch(err){
              console.log(err);
              console.error("critical error at matchmaking quene");
            }
          });
          
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
        try{
          activePlayers[response.validity.username] = ws;

          const matches = await sequelize.define(`Matches`, models.matches);
          const match = await matches.findOne({where: {
            [Sequelize.Op.or]: [
              {player1: response.validity.id},
              {player2: response.validity.id}
            ],
            status:"ongoing"
          }});

          const users = await sequelize.define(`Users`, models.users);
          const player2 = await users.findOne({where:{id: validity.id === match.dataValues.player1 ? match.dataValues.player2 : match.dataValues.player1}});

          //will calculate the time elapsed from the start of the match(in seconds)
          const currentTime = new Date();
          const time = match.dataValues.createdAt.getTime() - currentTime.getTime(); 

          const returnObj = {
            opponent: {
              username: player2.dataValues.username,
              points: player2.dataValues.points,
              matchID: match.dataValues.id
            },
            turn: match.dataValues.turn,
            time,
            team:player2.dataValues.id === match.dataValues.player2 ? "white": "black",//black or white
            localization:{}
          }
          console.log(player2.dataValues.id === match.dataValues.player2 ? "white": "black");
          Object.entries(match.dataValues).forEach(([piece, location]) => {
            if(piece.length <= 3 && location && piece !== "id"){//use just the piece location keys
              returnObj.localization[location] = piece;
            }
          });

          ws.send(JSON.stringify({type:"set", data:returnObj}));
        }catch(err){
          console.log(err);
          console.error("critical error at ws/match");
        }
      };
    }

    //used to show a user the possible moves for a selected piece

    else if(data.type === `checkMove`){

      const matches = await sequelize.define(`Matches`, models.matches);
      const match = await matches.findOne({where:{id: data.matchID}});
      ws.send(JSON.stringify({data:gameLogic.checkMove(match, data.location), type: "checkMove"}));

    }

    else if(data.type === 'move'){

      const response = await checkCookie(req.cookies.credentials);
      if(!response.validity){return};

      console.log(data);
      const matches = await sequelize.define(`Matches`, models.matches);
      const match = await matches.findOne({where:{id: data.matchID}});
      const moveData = gameLogic.move(match, data.selected, data.targetLocation);

      if(moveData){
        sequelize.transaction(async t => {

          const matches = await sequelize.define(`Matches`, models.matches);
          const match = await matches.findOne({where: {id: data.matchID}});
          const newTurn = match.dataValues.turn === "white" ? "black" : "white";

          //in case that a user is tring to move a piece in an already ended match
          if(match.dataValues.status === "ended"){return}

          await matches.update({
            [moveData.movedPiece]: `${String.fromCharCode(96+moveData.targetPosition[1]+1)}${moveData.targetPosition[0]+1}`,
            turn: newTurn
          }, {
            where: {id: data.matchID}
          });

          await matches.sync();

          let addPoints = {}, winner;

          //required db modifications in case of a piece being destroyed(includes the game-over logic)
          if(moveData.attackedPiece){
            const points = {queen: 9, king: 40, pawn: 2, knight: 4, bishop: 4, rook: 6};
            let type;
            if(moveData.attackedPiece.length === 2){
              type = moveData.attackedPiece.slice(1, 2) === "Q" ? "queen" : "king";
            }else if(moveData.attackedPiece.length === 3){
              const pieces = {P : "pawn", K : "knight", B: "bishop", R: "rook"};
              type = pieces[moveData.attackedPiece.slice(1, 2)];
            }

            addPoints[response.validity.username] = points[type];
            const users = await sequelize.define(`Users`, models.users);

            //the game-over logic
            if(type === "king"){
              winner = moveData.attackedPiece.slice(0, 1) === "W" ? "black" : "white";
              console.log(winner, moveData.attackedPiece, " winner");
              await matches.update({[moveData.attackedPiece]: false, winner: winner, status: "ended"}, {where:{id: data.matchID}});
              await users.update({inMatch: false}, {where: {id: match.dataValues.player1}});
              await users.update({inMatch: false}, {where: {id: match.dataValues.player2}});
              if(winner === "white"){
                await users.update({wonMatches: Sequelize.literal(`wonMatches + 1`)}, {where: {id: match.dataValues.player1}});
              }else{
                await users.update({wonMatches: Sequelize.literal(`wonMatches + 1`)}, {where: {id: match.dataValues.player2}});
              }
            }else{
              await matches.update({[moveData.attackedPiece]: false}, {where:{id: data.matchID}});
            }
              await users.update(
                { points: Sequelize.literal(`points + ${points[type]}`) },
                { where: { username: response.validity.username } }
              );

              await users.sync();
              await matches.sync();

          }

          const matchHistory = await sequelize.define(`MH_${data.matchID}`, models.matchHistory);
          await matchHistory.sync(); 

          const formatedCurrentLocation = `${String.fromCharCode(96+data.selected[0])}${data.selected[1]}`; 

          console.log({
            pieceMoved: moveData.movedPiece, 
            movedFrom: formatedCurrentLocation,
            movedTo: data.targetLocation,
            attackedPiece: moveData.attackedPiece 
        });
          await matchHistory.create({
            pieceMoved: moveData.movedPiece, 
            movedFrom: formatedCurrentLocation,
            movedTo: data.targetLocation,
            attackedPiece: moveData.attackedPiece 
          });

          ws.send(JSON.stringify({
            type:"move",
            turn: newTurn, 
            selected: data.selected,
            movedPiece: moveData.movedPiece, 
            targetPosition: moveData.targetPosition, 
            attackedPiece: moveData.attackedPiece,
            addPoints,
            winner: winner
          }));
          
          console.log(data.opponent);
          if(activePlayers[data.opponent]){
            activePlayers[data.opponent].send(JSON.stringify({
              type:"move",
              turn: newTurn, 
              selected: data.selected,
              movedPiece: moveData.movedPiece, 
              targetPosition: moveData.targetPosition, 
              attackedPiece: moveData.attackedPiece,
              addPoints,
              winner: winner
            }));
          }

        });
      }

    }

  })
})



//auth
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




//request matches data(for logs or match history)
app.post("/matchesLog", async (req, res) => {//req.body.targetUser(boolean -- to include just the specific user matches)

  const response = await checkCookie(req.cookies.credentials);

  const matches = await sequelize.define(`Matches`, models.matches);
  await matches.sync();

  let data;
  if(req.body.targetUser){
    data = await matches.findAll({
      where: {
        [Sequelize.Op.or]: [
          {player1: response.validity.id},
          {player2: response.validity.id}
        ],
        status:"ended"
      }, 
      attributes:['id', 'player1', "player2", "winner"]
    });
  }else{
    data = await matches.findAll({where: {status: "ended"}, attributes:['id', 'player1', "player2", "winner"]});
  };

  const returnData = data.map(match => {
    return {...match.dataValues};
  })
  
  res.status(200).json({data: returnData});

})




app.listen(port, () => {
    console.log(`Chess app is online at port ${port}`);
});