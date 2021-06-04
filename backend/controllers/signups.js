const Signup = require("../models/signup");
const Truck = require("../models/truck");
const Cargo = require("../models/cargo");
const User = require("../models/user");
const Load = require("../models/load");
const mongoose = require("mongoose");
const Unload = require("../models/unload");

exports.createSignup = (req, res, next) => {
  const signup = new Signup({
    userId: req.userData.userId,
    cargoId: req.body.cargoId,
    truckId: req.body.truckId,
    approved: req.body.approved,
    finished: req.body.finished
  });
  signup.save()
  .then(result => {
    res.status(201).json({
      message: "Signup created!",
      result: result
    });
  })
  .catch(err => {
    res.status(500).json({
      message: "DB error!"
    });
  });
}

exports.getSignupsByUserId = (req, res, next) => {
  const ObjectId = mongoose.Types.ObjectId;
  const signupsQuery = Signup.aggregate([
    { $match: { userId: ObjectId(req.params.id)}},
    {
      $lookup: {
        from: Truck.collection.name,
        localField: "truckId",
        foreignField: "_id",
        as: "truck"
      }
    },
    {
    $lookup: {
      from: Cargo.collection.name,
      localField: "cargoId",
      foreignField: "_id",
      as: "cargo"
    }
  }
  ]);
  signupsQuery
  .then(document => {
    fetchedSignups = document;
    res.status(200).json({
      message: "Cargo fetched successfully!",
      signups: fetchedSignups,
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching cargo failed!"
    });
  });
};

exports.getSignupById = (req, res, next) => {
  const ObjectId = mongoose.Types.ObjectId;
  const signupsQuery = Signup.aggregate([
    { $match: { _id: ObjectId(req.params.id)}},
    {
      $lookup: {
        from: Truck.collection.name,
        localField: "truckId",
        foreignField: "_id",
        as: "truck"
      }
    },
    { "$lookup": {
      "from": Cargo.collection.name,
      "let": { "cargo_id": "$cargoId"},
      "pipeline": [
        { "$match": { "$expr": { "$eq": ["$_id", "$$cargo_id"] }}},
        { "$lookup": {
          "from": Unload.collection.name,
          "let": { "unload_cargo_id": "$_id" },
          "pipeline": [
            { "$match": { "$expr": { "$eq": ["$cargoId", "$$unload_cargo_id"] }}}
          ],
          "as": "unload"
        }},
      ],
      "as": "cargo"
    }},

  {
    $lookup: {
      from: User.collection.name,
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  }
  ]);
  signupsQuery
  .then(document => {
    res.status(200).json(document);
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching signup failed!"
    });
  });
};
