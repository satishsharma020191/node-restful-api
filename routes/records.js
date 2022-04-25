const express = require("express");

const recordRoutes = express.Router();

// This will help us connect to the database
const db = require("../db/connection");

recordRoutes.route('/fetch/records').post(function (req, res) {
    const dbConnect = db.getDb();
    const matches = [];
    const aggregationQuery = [
        {
          $project: {
            key: 1,
            createdAt: 1,
            totalCount: { $sum: '$counts' },
          },
        },
      ];
      const filter = req.body;
      if (filter.startDate) matches.push({ createdAt: { $gt: new Date(filter.startDate) } });
      if (filter.endDate) matches.push({ createdAt: { $lt: new Date(filter.endDate) } });
      if (filter.minCount !== undefined) matches.push({ totalCount: { $gt: filter.minCount } });
      if (filter.maxCount !== undefined) matches.push({ totalCount: { $lt: filter.maxCount } });
      if (matches.length !== 0) {
        aggregationQuery.push({
          $match: {
            $and: matches,
          },
        });
      }  
    dbConnect
      .collection('records')
      .aggregate(aggregationQuery)
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send('Error fetching listings!');
        } else {
          res.json(result);
        }
      });
  });

module.exports = recordRoutes;