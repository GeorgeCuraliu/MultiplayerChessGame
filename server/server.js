const express = require("express");
const cors = require("cors");
const Sequelize = require("sequelize");
const expressWs = require("express-ws");
const dotenv = require('dotenv');
const models = require('./models');

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./db.db",
    logging: false,
    freeTableName: true
});

const app = express();
dotenv.config();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
const expressWsInstance = expressWs(app);
const ws = expressWsInstance.getWss();

app.post("/login", (req, res) => {
    console.log(req.body);
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
      
              return res.sendStatus(200);
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
        return res.sendStatus(500);
    }


});





app.listen(port, () => {
    console.log(`Chess app is online at port ${port}`);
});
