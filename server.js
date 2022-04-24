// Load config.env to process.env
require("dotenv").config({ path: "./config.env"});
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;
const database = require("./db/connection");
app.use(require("./routes/records"));
 
app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (err, _req, res) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// database connection
database.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  // start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});
