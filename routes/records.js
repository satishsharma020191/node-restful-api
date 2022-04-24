const express = require("express");

const recordRoutes = express.Router();

// This will help us connect to the database
const db = require("../db/connection");

recordRoutes.route('/fetch/records').post(async function (_req, res) {
    const dbConnect = db.getDb();
  
    dbConnect
      .collection('records')
      .find({})
      //.limit(50)
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send('Error fetching listings!');
        } else {
          res.json(result);
        }
      });
  });

module.exports = recordRoutes;