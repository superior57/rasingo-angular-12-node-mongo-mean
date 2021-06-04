const Cargo = require("../models/cargo");
const Load = require("../models/load");
const UnLoad = require("../models/unload");
const User = require("../models/user");
const Signup = require("../models/signup");
const Truck = require("../models/truck");
const mongoose = require("mongoose");
const CMR = require("../models/cmr");

exports.createCargo = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const cargo = new Cargo({
    cargoType: req.body.cargoType,
    description: req.body.description,
    price: req.body.price,
    height: req.body.height,
    width: req.body.width,
    clength: req.body.clength,
    weight: req.body.weight,
    date: Date("YYYY-mm-dd"),
    userId: req.userData.userId
  });
  console.log(cargo);
  cargo.save(function(error) {
    for (i = 0; i < req.body.loads.length; i++) {
      const load = new Load({
        address: req.body.loads[i].loadAddress,
        city: req.body.loads[i].loadCity,
        countryCode: req.body.loads[i].loadCountry,
        date: req.body.loads[i].loadDate,
        time: req.body.loads[i].loadTime,
        cargoId: cargo._id
      });
      Load.create(load);
    }
    for (i = 0; i < req.body.unLoads.length; i++) {
      const unLoad = new UnLoad({
        address: req.body.unLoads[i].unLoadAddress,
        city: req.body.unLoads[i].unLoadCity,
        countryCode: req.body.unLoads[i].unLoadCountry,
        date: req.body.unLoads[i].unLoadDate,
        time: req.body.unLoads[i].unLoadTime,
        cargoId: cargo._id
      });
      UnLoad.create(unLoad);
    }
    if (error) {
      res.send(error);
    } else {
      res.json({ message: 'Cargo created!'});
    }
  });
}


exports.updateCargo = (req, res, next) => {
  const cargo = new Cargo({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    creator: req.userData.userId
  });
  Cargo.updateOne({ _id: req.params.id, creator: req.userData.userId }, cargo)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate post!"
      });
    });
};

exports.getCargos = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const cargoQuery = Cargo.aggregate([
  {
  $lookup: {
    from: Load.collection.name,
    localField: "_id",
    foreignField: "cargoId",
    as: "loads"
  }
  },
  {
  $lookup: {
    from: UnLoad.collection.name,
    localField: "_id",
    foreignField: "cargoId",
    as: "unLoads"
  }
},
{
  $sort : {
    date : -1
  }
}
  ]);
  let fetchedCargos;
  if (pageSize && currentPage) {
    cargoQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  cargoQuery
    .then(documents => {
      fetchedCargos = documents;
      return Cargo.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        cargos: fetchedCargos,
        maxCargos: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });
};

exports.getMyCargos = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  console.log(req.query.tRuleMaxWeightPALLETIZED);
  console.log(req.query.cRulePALLETIZED);
  const cargoQuery = Cargo.aggregate([
  {
    $match: {
      $or: [
        {cargoType: {$eq: req.query.cRuleINDBULK}, $expr: {$lte: [{ $multiply: ["$weight", 0.98]}, +req.query.tRuleMaxWeightINDBULK]}},
        {cargoType: {$eq: req.query.cRuleFOODBULK}, $expr: {$lte: [{ $multiply: ["$weight", 0.98]}, +req.query.tRuleMaxWeightFOODBULK]}},
        {cargoType: {$eq: req.query.cRuleADR}, $expr: {$lte: [{ $multiply: ["$weight", 0.98]}, +req.query.tRuleMaxWeightADR]}},
        {cargoType: {$eq: req.query.cRulePALLETIZED}, $expr: {$lte: [{ $multiply: ["$weight", 0.98]}, +req.query.tRuleMaxWeightPALLETIZED]}},
        {cargoType: {$eq: req.query.cRuleNOTPALLETIZED}, $expr: {$lte: [{ $multiply: ["$weight", 0.98]}, +req.query.tRuleMaxWeightNOTPALLETIZED]}},
        {cargoType: {$eq: req.query.cRuleINDLIQ}, $expr: {$lte: [{ $multiply: ["$weight", 0.98]}, +req.query.tRuleMaxWeightINDLIQ]}},
        {cargoType: {$eq: req.query.cRuleFOODLIQ}, $expr: {$lte: [{ $multiply: ["$weight", 0.98]}, +req.query.tRuleMaxWeightFOODLIQ]}},
        {cargoType: {$eq: req.query.cRuleREFRIGERATED}, $expr: {$lte: [{ $multiply: ["$weight", 0.98]}, +req.query.tRuleMaxWeightREFRIGERATED]}},
        {cargoType: {$eq: req.query.cRuleSPECIALLENGHTS}, $expr: {$lte: [{ $multiply: ["$weight", 0.98]}, +req.query.tRuleMaxWeightSPECIALLENGHTS]}},
        {cargoType: {$eq: req.query.cRuleANIMALS}, $expr: {$lte: [{ $multiply: ["$weight", 0.98]}, +req.query.tRuleMaxWeightANIMALS]}},
        {cargoType: {$eq: req.query.cRuleHANG}, $expr: {$lte: [{ $multiply: ["$weight", 0.98]}, +req.query.tRuleMaxWeightHANG]}},
        {cargoType: {$eq: req.query.cRuleSPECIALHEIGHTS}, $expr: {$lte: [{ $multiply: ["$weight", 0.98]}, +req.query.tRuleMaxWeightSPECIALHEIGHTS]}},
        {cargoType: {$eq: req.query.cRuleSPECIAL}, $expr: {$lte: [{ $multiply: ["$weight", 0.98]}, +req.query.tRuleMaxWeightSPECIAL]}},
        {cargoType: {$eq: req.query.cRuleVEHICLES}, $expr: {$lte: [{ $multiply: ["$weight", 0.98]}, +req.query.tRuleMaxWeightVEHICLES]}},
        {cargoType: {$eq: req.query.cRuleCONTAINER}, $expr: {$lte: [{ $multiply: ["$weight", 0.98]}, +req.query.tRuleMaxWeightCONTAINER]}},
      ],
      $or: [
        {contNum: {$exists: true, $ne: null, $lte: req.query.maxContNum}}
      ]

  }},
  { $lookup: {
    from: Load.collection.name,
    localField: "_id",
    foreignField: "cargoId",
    as: "loads"
  }
  },
  {
  $lookup: {
    from: UnLoad.collection.name,
    localField: "_id",
    foreignField: "cargoId",
    as: "unLoads"
  }
},
{
  $sort : {
    date : -1
  }
}
  ]);
  let fetchedCargos;
  if (pageSize && currentPage) {
    cargoQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  cargoQuery
    .then(documents => {
      fetchedCargos = documents;
      return Cargo.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        cargos: fetchedCargos,
        maxCargos: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });
};

exports.getCargoAndLoadsUnloads = (req, res, next) => {
  const ObjectId = mongoose.Types.ObjectId;
  const cargoQuery = Cargo.aggregate([
    { $match: { _id: ObjectId(req.params.id)}},
    {
    $lookup: {
      from: Load.collection.name,
      localField: "cargoId",
      foreignField: "_id",
      as: "loads"
    }
  },
  {
  $lookup: {
    from: UnLoad.collection.name,
    localField: "cargoId",
    foreignField: "_id",
    as: "unLoads"
  }
  }]);
  cargoQuery
  .then(document => {
    fetchedCargo = document;
    res.status(200).json({
      message: "Cargo fetched successfully!",
      cargo: fetchedCargo,
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching cargo failed!"
    });
  });
};

exports.deleteCargo = (req, res, next) => {
  Cargo.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting posts failed!"
      });
    });
};

exports.getCargosByUserId = (req, res, next) => {
  const ObjectId = mongoose.Types.ObjectId;
  const cargoQuery = Cargo.aggregate([
    { $match: {userId: ObjectId(req.userData.userId)}},
    {
    $lookup: {
      from: Load.collection.name,
      localField: "_id",
      foreignField: "cargoId",
      as: "loads"
    }
  },
  {
    $lookup: {
      from: UnLoad.collection.name,
      localField: "_id",
      foreignField: "cargoId",
      as: "unLoads"
    }
  }, { "$lookup": {
    "from": Signup.collection.name,
    "let": { "cargo_id": "$_id"},
    "pipeline": [
      { "$match": { "$expr": { "$eq": ["$cargoId", "$$cargo_id"] }}},
      { "$lookup": {
        "from": User.collection.name,
        "let": { "signup_user_id": "$userId" },
        "pipeline": [
          { "$match": { "$expr": { "$eq": ["$_id", "$$signup_user_id"] }}}
        ],
        "as": "user"
      }},
      { "$lookup": {
        "from": Truck.collection.name,
        "let": { "signup_truck_id": "$truckId" },
        "pipeline": [
          { "$match": { "$expr": { "$eq": ["$_id", "$$signup_truck_id"] }}}
        ],
        "as": "truck"
      }}
    ],
    "as": "signUps"
  }},
  {
    $sort : {
      date : -1
    }
  }
]);
  cargoQuery
  .then(documents => {
    fetchedCargos = documents;
    res.status(200).json({
      message: "Cargo fetched successfully!",
      cargos: fetchedCargos,
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching cargo failed!"
    });
    console.log(error)
  });
};

exports.chooseTransporter = (req, res, next) => {
  const transporter = new Signup({
    _id: req.params.signupId,
    approved: req.body.approved
  });
  Signup.updateOne({ _id: req.params.signupId}, transporter).then(result => {
    res.status(201).json({
      message: "Signup updated!",
      result: result
    });
  })
  .catch(err => {
    res.status(500).json({
      message: "DB error!"
    });
  });
}

exports.getCargosForProfile = (req, res, next) => {
  const ObjectId = mongoose.Types.ObjectId;
  const cargoQuery = Cargo.aggregate([
    { $match: {userId: ObjectId(req.params.userId)}},
    {
    $lookup: {
      from: Load.collection.name,
      localField: "_id",
      foreignField: "cargoId",
      as: "loads"
    }
  },
  {
    $lookup: {
      from: UnLoad.collection.name,
      localField: "_id",
      foreignField: "cargoId",
      as: "unLoads"
  }},
]);
  cargoQuery
  .then(documents => {
    fetchedCargos = documents;
    res.status(200).json({
      message: "Cargo fetched successfully!",
      cargos: fetchedCargos,
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching cargo failed!"
    });
    console.log(error)
  });
};

exports.addCMR = (req, res, next) => {
  const cmr = new CMR({
    sender: req.body.sender,
    intList: req.body.intList,
    reciever: req.body.reciever,
    transporter: req.body.transporter,
    otherTransporters: req.body.otherTransporters,
    placeOfDelivery: req.body.placeOfDelivery,
    placeAndDateOfPickUp: req.body.placeAndDateOfPickUp,
    remarks: req.body.remarks,
    accompanyingLists: req.body.accompanyingLists,
    label: req.body.label,
    parcelNum: req.body.parcelNum,
    typeOfPackaging: req.body.typeOfPackaging,
    typeOfCargo: req.body.typeOfCargo,
    statisticNum: req.body.statisticNum,
    grossWeight: req.body.grossWeight,
    volume: req.body.volume,
    instructions: req.body.instructions,
    deals: req.body.deals,
    provisions: req.body.provisions,
    expensesSender: req.body.expensesSender,
    expensesCurrency: req.body.expensesCurrency,
    expensesReciever: req.body.expensesReciever,
    residueSender: req.body.residueSender,
    residueCurrency: req.body.residueCurrency,
    residueReciever: req.body.residueReciever,
    totalSender: req.body.totalSender,
    totalCurrency: req.body.totalCurrency,
    totalReciever: req.body.totalReciever,
    turned: req.body.turned,
    company: req.body.company,
    signatureSender: req.body.signatureSender,
    signatureTransporter: req.body.signatureTransporter,
    signatureReciever: req.body.signatureReciever,
    userId: req.userData.userId,
    signupId: req.body.signupId
  });
  cmr
    .save()
    .then(createdCMR => {
      res.status(201).json(
        {
          message: "CMR added successfully",
          cmr: {
            ...createdCMR,
            id: createdCMR._id
          }
        }
      );
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a post failed!"
      });
    });
};

exports.getCMRById = (req, res, next) => {
  const ObjectId = mongoose.Types.ObjectId;
  const cmrQuery = CMR.aggregate([
    { $match: {_id: ObjectId(req.params.cmrId)}},
  ]);
  cmrQuery
  .then(document => {
    res.status(200).json(document);
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching cargo failed!"
    });
    console.log(error)
  });
};
