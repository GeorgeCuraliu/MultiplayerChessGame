const express = require("express");
const cors = require("cors");
const expressWs = require("express-ws");
const dotenv = require('dotenv');

const app = express();
dotenv.config();
const port = process.env.PORT;
console.log(port);

app.use(express.static('./client'));
app.use(express.json());
app.use(cors());
const expressWsInstance = expressWs(app);
const ws = expressWsInstance.getWss();

app.post("/login", (req, res) => {
    console.log(req.body);
});





app.listen(port, () => {
    console.log(`Chess app is online at port ${port}`);
});
