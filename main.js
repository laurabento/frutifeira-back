const express = require("express"); //Import the express dependency
const app = express(); //Instantiate an express app, the main work horse of this server
const usuarios    = require("./routes/usuario");
const produtos    = require("./routes/produto");
const feiras      = require("./routes/feira");
const feirantes   = require("./routes/feirantes");
const condominios = require("./routes/condominios");
const pedidos     = require("./routes/pedido");
const port = 3000; //Save the port number where your server will be listening

app.use(express.json());
app.use("/api/v1.0/users/", usuarios);
app.use("/api/v1.0/products/", produtos);
app.use("/api/v1.0/stands/", feiras);
app.use("/api/v1.0/marketvendors/", feirantes);
app.use("/api/v1.0/condominium/", condominios);
app.use("/api/v1.0/orders/", pedidos);

//Idiomatic expression in express to route and respond to a client request
app.get("/", (req, res) => {
  //get requests to the root ("/") will route here
  res.sendFile("index.html", { root: __dirname }); //server responds by sending the index.html file to the client's browser
  //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile
});

app.listen(port, () => {
  //server starts listening for any attempts from a client to connect at port: {port}
  console.log(`Now listening on port ${port}`);
});
