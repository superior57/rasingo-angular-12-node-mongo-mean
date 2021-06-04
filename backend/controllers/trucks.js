const Truck = require("../models/truck");

exports.getTrucksByUserId = (req, res, next) => {
  const trucksQuery = Truck.find({userId: req.params.id});
  trucksQuery
  .then(result => {
    fetchedTrucks = result;
    res.status(200).json({
      message: "Trucks fetched successfully!",
      trucks: fetchedTrucks,
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching cargo failed!"
    });
  });
};

exports.deleteTruck = (req, res, next) => {
  Truck.deleteOne({ _id: req.params.id })
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

exports.addNewTrucks = (req, res, next) => {
  for (i = 0; i < req.body.trucks.length; i++) {
    let width = null;
    let height = null;
    let tlength = null;
    if(
      req.body.trucks[i].truckType == 'truck_refrigerated' ||
      req.body.trucks[i].truckType == 'truck' ||
      req.body.trucks[i].truckType == 'truck_van_hang' ||
      req.body.trucks[i].truckType == 'truck_half_trailer' ||
      req.body.trucks[i].truckType == 'truck_trailer' ||
      req.body.trucks[i].truckType == 'truck_special' ||
      req.body.trucks[i].truckType == 'truck_container' ||
      req.body.trucks[i].truckType == 'truck_vehicles' ||
      req.body.trucks[i].truckType == 'combi' ||
      req.body.trucks[i].truckType == 'caddy'
      ) {
      width = req.body.trucks[i].width;
      height = req.body.trucks[i].height;
      tlength = req.body.trucks[i].tlength;
      width = width.replace(/,/g, '.');
      height = height.replace(/,/g, '.');
      tlength = tlength.replace(/,/g, '.');
    }
    const truck = new Truck({
      truckModel: req.body.trucks[i].truckModel,
      truckType: req.body.trucks[i].truckType,
      year: req.body.trucks[i].year,
      regNumber: req.body.trucks[i].regNumber,
      regDate: req.body.trucks[i].regDate,
      maxWeight: req.body.trucks[i].maxWeight,
      euroNorm: req.body.trucks[i].euroNorm,
      width: width,
      height: height,
      tlength: tlength,
      userId: req.userData.userId,
      hydraulicRamp: req.body.trucks[i].hydraulicRamp,
      crane: req.body.trucks[i].crane,
      winches: req.body.trucks[i].winches,
      adjustableRoof: req.body.trucks[i].adjustableRoof,
      movableFloor: req.body.trucks[i].movableFloor,
      movableTarpaulin: req.body.trucks[i].movableTarpaulin,
      rotatingSignalLight: req.body.trucks[i].rotatingSignalLight,
      containerLifter: req.body.trucks[i].containerLifter,
      approved: false,
      used: false
    });
    const query = Truck.create(truck);
    query.then(result => {
      trucks = result;
      res.status(200).json({
        message: "Truck created successfully!",
        trucks: trucks,
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Error"
      });
    });
  }
}

/*Admin*/
exports.getTrucks = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const truckQuery = Truck.aggregate([
  { $sort : {regDate : -1 }}
  ]);
  let fetchedTrucks;
  if (pageSize && currentPage) {
    truckQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  truckQuery
    .then(documents => {
      fetchedTrucks = documents;
      return Truck.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Trucks fetched successfully!",
        trucks: fetchedTrucks,
        maxTrucks: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching users failed!"
      });
    });
};

exports.downloadFile = (req, res) => {
  const file = `backend/truckdocs/${req.params.name}`;
  res.download(file);
}

exports.approve = (req, res, next) => {
  const truck = new Truck({
    _id: req.params.id,
    approved: req.body.approved
  });
  Truck.updateOne({ _id: req.params.id}, truck).then(result => {
    res.status(201).json({
      message: "Truck updated!",
      result: result
    });
  })
  .catch(err => {
    res.status(500).json({
      message: "DB error!"
    });
  });
}
