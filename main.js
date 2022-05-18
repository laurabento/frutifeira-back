const express = require("express"); //Import the express dependency
const mongoose = require("mongoose");
var cors = require('cors');
require("dotenv").config();

const app = express(); //Instantiate an express app, the main work horse of this server
const usuarios    = require("./app/routes/usuario");
const produtos    = require("./app/routes/produto");
const feiras      = require("./app/routes/feira");
const feirantes   = require("./app/routes/feirantes");
const condominios = require("./app/routes/condominios");
const pedidos     = require("./app/routes/pedido");
const feiranteCondominios = require("./app/routes/feiranteCondominio");
const port = process.env.PORT || 5000; //Save the port number where your server will be listening

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/api/v1.0/users/", usuarios);
app.use("/api/v1.0/products/", produtos);
app.use("/api/v1.0/stands/", feiras);
app.use("/api/v1.0/marketvendors/", feirantes);
app.use("/api/v1.0/condominium/", condominios);
app.use("/api/v1.0/marketcondominium/", feiranteCondominios);
app.use("/api/v1.0/orders/", pedidos);

//Idiomatic expression in express to route and respond to a client request
app.get("/", (req, res) => {
  //get requests to the root ("/") will route here
  res.sendFile("index.html", { root: __dirname }); //server responds by sending the index.html file to the client's browser
  //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile
});

if (process.env.NODE_ENV !== 'TES') {
  mongoose
    .connect(process.env.DB_STR_CONNECTION)
    .then(() => {
      server = app.listen(port, () => {
        //server starts listening for any attempts from a client to connect at port: {port}
        console.log(`Now listening on port ${port}`); 
      });
      
      console.log(server.address())
    })
    .catch((err => console.log(err)))
}

module.exports = app;