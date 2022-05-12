const app = require('./main');


app.listen(5000, () => {
    //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port 5000`); 
  });