const Transport = require("../models/transport");
const Load = require("../models/load");
const UnLoad = require("../models/unload");
const User = require("../models/user");
const Signup = require("../models/signup");
const Truck = require("../models/truck");
const mongoose = require("mongoose");

exports.createTransport = (req, res, next) => {
  const transport = new Transport({
    //transportDate: req.body.transportDate,
    no: req.body.no,
    placekg: req.body.placekg,
    start: req.body.start,
    destination: req.body.destination,
    description: req.body.description,
    userId: req.userData.userId,
    truckId: req.body.truckId
  });
  transport.save()
  .then(result => {
    res.status(201).json({
      message: "Transport created!",
      result: result
    });
  })
  .catch(err => {
    res.status(500).json({
      message: "DB eror!"
    });
  });
}

exports.getTransports = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const transportQuery = Transport.aggregate([
    {
    $lookup: {
      from: Truck.collection.name,
      localField: "truckId",
      foreignField: "_id",
      as: "truck"
    }
  }
  ]);
  let fetchedTransports;
  if (pageSize && currentPage) {
    transportQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  transportQuery
    .then(documents => {
      fetchedTransports = documents;
      return Transport.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Transports fetched successfully!",
        transports: fetchedTransports,
        maxTransports: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching transport failed!"
      });
    });
};
