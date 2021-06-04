const Profile = require("../models/profile");
const User = require("../models/user");
const Truck = require("../models/truck");
const mongoose = require("mongoose");
const Inviter = require("../models/inviter");
const Review = require("../models/review");
const nodemailer = require('nodemailer');

exports.createProfile = (req, res, next) => {
  const profile = new Profile({
    userId: req.userData.userId,
    about: req.body.about,
    web: req.body.web,
    employees: req.body.employees,
    year: req.body.year,
    workingHours: req.body.workingHours
  });
  profile
    .save()
    .then(
      User
      .findOneAndUpdate({_id: req.userData.userId}, {$set: {isProfileCompleted: true}})
      .then(
        Inviter.findOne({childId: req.userData.userId}, function(err, inviter) {
          if(inviter) {
            User.findOneAndUpdate({_id: inviter.parentId}, {$inc: { "inviteMonths": 1}})
            .then(result => {
              User.findOne({_id: inviter.parentId}, function(err, user) {
                var transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: { user: 'nikola.balog@gmail.com', pass: '6hrhjJrhc8' }
                });
                var mailOptions = {
                  from: 'no-reply@rasingo.com',
                  to: user.email,
                  subject: 'Free months',
                  text: 'Zahvaljujemo Vam na preporuci Rasinga Vašim poslovnim partnerima. Kao mali znak zahvalnosti poklanjamo vam dodatnih 30 dana besplatnog korištenja Rasingo usluga. Još jednom od srca hvala i sretno u Vašem poslovanju.Radujemo se i cijenimo svakog korisnika te ukoliko želite naše usluge preporučiti i drugim svojim partnerima, bit ćemo iznimno zahvalni.'
                };
                transporter.sendMail(mailOptions);
              });
              res.status(201).json({
                message: "User profile added successfully",
                profile: result
              });
            })
            .catch(error => {
              res.status(500).json({
                message: "Creating user profile failed!"
              });
            })
          } else {
            res.status(201).json({
              message: "User profile added successfully"
            });
          }
        })
      )
    );
};

exports.createCoverPhoto =  (req, res, next) => {
  Profile
    .findOneAndUpdate({userId: req.userData.userId}, {$set: {coverPhoto: req.file.filename}})
    .then(createdImages => {
      res.status(201).json({
        message: "Profile photo added successfully",
        coverPhoto: createdImages
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating photo failed!"
      });
    });
}

exports.createProfilePhoto =  (req, res, next) => {
  Profile
    .findOneAndUpdate({userId: req.userData.userId}, {$set: {profilePhoto: req.file.filename}})
    .then(
      createdImages => {
      res.status(201).json({
        message: "Profile photo added successfully",
        profilePhoto: createdImages
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating photo failed!"
      });
    });
}

exports.getUserProfile = (req, res, next) => {
  const ObjectId = mongoose.Types.ObjectId;
  const profileQuery = Profile.aggregate([
    { $match: {userId: ObjectId(req.userData.userId)}},
    {
    $lookup: {
      from: User.collection.name,
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  },
  {
    $lookup: {
      from: Truck.collection.name,
      localField: "owner",
      foreignField: "_id",
      as: "trucks"
    }
  }
]);
  profileQuery
  .then(documents => {
    fetchedProfile = documents;
    res.status(200).json({
      message: "Cargo fetched successfully!",
      profile: fetchedProfile,
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching cargo failed!"
    });
  });
};

exports.getPublicUserProfile = (req, res, next) => {
  const ObjectId = mongoose.Types.ObjectId;
  const profileQuery = Profile.aggregate([
    { $match: {userId: ObjectId(req.params.userId)}},
    {
    $lookup: {
      from: User.collection.name,
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  },
  {
    $lookup: {
      from: Truck.collection.name,
      localField: "owner",
      foreignField: "_id",
      as: "trucks"
    }
  }
]);
  profileQuery
  .then(documents => {
    fetchedProfile = documents;
    res.status(200).json({
      message: "Cargo fetched successfully!",
      profile: fetchedProfile,
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching cargo failed!"
    });
  });
};

exports.getProfileInfoById = (req, res, next) => {
  const ObjectId = mongoose.Types.ObjectId;
  const profileQuery = Profile.aggregate([
    { $match: {userId: ObjectId(req.userData.userId)}}
  ]);
  profileQuery
  .then(documents => {
    res.status(200).json(documents);
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching cargo failed!"
    });
  });
};

exports.updateInfo = (req, res, next) => {
  Profile.findOneAndUpdate({ userId: req.userData.userId }, {$set: {
    about: req.body.about,
    web: req.body.web,
    employees: req.body.employees,
    year: req.body.year,
    workingHours: req.body.workingHours
  }})
    .then(result => {
      res.status(201).json({
        message: "Info updated!",
        result: result
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't update info!"
      });
    });
};

exports.addReview = (req, res, next) => {
  console.log(req.body.review);
  console.log(req.body.stars);
  console.log(req.body.childId);
  const review = new Review({
    review: req.body.review,
    stars: req.body.stars,
    parentId: req.userData.userId,
    childId: req.body.childId,
    date: Date("YYYY-mm-dd")
  });
  review
    .save().then(result => {
      res.status(201).json({
        message: "Review added",
        result: result
      });
    }).catch(error => {
      res.status(500).json({
        message: "Couldn't add review"
      });
    });
};

exports.getReviewsByChildId = (req, res, next) => {
  const ObjectId = mongoose.Types.ObjectId;
  const reviewQuery = Review.aggregate([
    { $match: {childId: ObjectId(req.params.childId)}},
    {
      $lookup: {
        from: Profile.collection.name,
        localField: "parentId",
        foreignField: "userId",
        as: "profile"
      }
    },
    { $sort : {date : -1 }}
  ]).limit(5);
  reviewQuery
  .then(documents => {
    res.status(200).json(documents);
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching reviews failed!"
    });
  });
};


