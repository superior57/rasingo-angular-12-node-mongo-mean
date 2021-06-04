const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const randomstring = require("randomstring");
const EmailVerificationCode = require("../models/email-code");
const User = require("../models/user");
const Truck = require("../models/truck");
const Docs = require("../models/docs");
let aws = require('aws-sdk');
const PhoneCode = require("../models/phone-code");
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID , process.env.TWILIO_AUTH_TOKEN);
const Invitation = require('../models/invitation');
const Inviter = require('../models/inviter');
const PasswordCode = require('../models/password-code');
const Newsletter = require("../models/newsletter");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      registrationStep: req.body.registrationStep,
      isEmailVerified: false,
      isTelephoneVerified: false,
      regDate: Date.now(),
      approved: false,
      isAdmin: false,
      isProfileCompleted: false,
      isTelephoneVerified: false,
      inviteMonths: 0
    });
    user
      .save().then(()=> {
      if(req.body.inviteCode != '') {
        Invitation.findOne({inviteCode: req.body.inviteCode}, function(err, inviteCode) {
          if(!inviteCode) {
            return res.status(400).send({ message: 'We were unable to find a valid token. Your token my have expired.' });
          }
          inviter = new Inviter({
            parentId: inviteCode.userId,
            childId: user._id
          });
          inviter.save();
        });
      }
      var randomString = randomstring.generate(30);
      var emailVerificationCode = new EmailVerificationCode(
        { _userId: user._id, emailVerificationCode: randomString }
      );
      emailVerificationCode.save(() => {
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: 'nikola.balog@gmail.com', pass: '6hrhjJrhc8' }
        });
        var mailOptions = {
          from: 'no-reply@rasingo.com',
          to: user.email,
          subject: 'Account Verification Code',
          text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api/user/confirmation\/?emailVerificationCode=' + emailVerificationCode.emailVerificationCode + '.\n'
        };
        transporter.sendMail(mailOptions)
      });
    })
    .then(result => {
      res.status(201).json({
        message: "User created!",
        result: result
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "DB error!"
      });
    });
  });
}

exports.resendAC = (req, res, next) => {
  var randomString = randomstring.generate(30);
  var emailVerificationCode = new EmailVerificationCode(
    { _userId: req.userData.userId, emailVerificationCode: randomString }
  );
  emailVerificationCode.save().then(() => {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: 'nikola.balog@gmail.com', pass: '6hrhjJrhc8' }
    });
    var mailOptions = {
      from: 'no-reply@rasingo.com',
      to: req.userData.email,
      subject: 'Account Verification Code',
      text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api/user/confirmation\/?emailVerificationCode=' + emailVerificationCode.emailVerificationCode + '.\n'
    };
    transporter.sendMail(mailOptions)
  }).then(result => {
    res.status(201).json({
      message: "Email sent",
      result: result
    });
  })
  .catch(err => {
    res.status(500).json({
      message: "DB error!"
    });
  });
}

exports.deleteAC = (req, res, next) => {
  EmailVerificationCode.deleteOne({_userId: req.userData.userId})
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting AC failed!"
      });
    });
};

exports.createUserStep1 = (req, res, next) => {
    User
    .findOneAndUpdate({_id: req.userData.userId}, {$set: {
      companyName: req.body.companyName,
      taxNo: req.body.taxNo,
      dialCode: req.body.dialCode,
      telephone: req.body.telephone,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      postalCode: req.body.postalCode,
      userType: req.body.userType,
      registrationStep: req.body.registrationStep
    }})
      .then(() => {
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
          Truck.create(truck);
        }
      }).then((result) => {
        res.status(201).json({
          message: "User updated!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "DB error!"
        });
      });
}

exports.createUserStep2 = (req, res, next) => {
  const user = new User({
    _id: req.userData.userId,
    registrationStep: req.body.registrationStep
  });
  User.updateOne({ _id: req.userData.userId}, user).then(result => {
    res.status(201).json({
      message: "User updated!",
      result: result
    });
  })
  .catch(err => {
    res.status(500).json({
      message: "DB error!"
    });
  });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Wrong password"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id, dialCode: fetchedUser.dialCode, telephone: fetchedUser.telephone, companyName: fetchedUser.companyName },
        process.env.JWT_KEY
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
}

exports.confirmationPost = function (req, res, next) {
  EmailVerificationCode.findOne({emailVerificationCode: req.query.emailVerificationCode}, function(err, emailVerificationCode) {
    if(!emailVerificationCode) {
      return res.status(400).send({ message: 'We were unable to find a valid token. Your token my have expired.' });
    }
    User.findOne({ _id: emailVerificationCode._userId }, function(err, user) {
      if (!user) return res.status(400).send({ message: 'We were unable to find a user for this token.' });
      if (user.isEmailVerified) return res.status(400).send({ type: 'not-verified', message: 'This user has already been verified.' });
      user.isEmailVerified = true;
      user.save(function(err) {
        if(err) {
          { return res.status(500).send({ message: 'DB error!' }); }
        }
        res.redirect('http://localhost:4200/auth/login/?&verifyMessage=true');
      });
    });
  });
}

exports.getUserData = function (req, res, next) {
  User.findById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching user failed"
      });
    });
}

exports.createDocs = (req, res, next) => {
  const docs = new Docs({
    docsFileName: req.file.filename,
    userId: req.userData.userId,
    docType: req.body.docType
  });
  docs
    .save()
    .then(createdDocs => {
      res.status(201).json({
        message: "Doc added successfully",
        post: {
          ...createdDocs,
          id: createdDocs._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a doc failed!"
      });
    });
};

exports.createTruckDocs = (req, res, next) => {
  Truck.findOneAndUpdate({ _id: req.body.truckId}, {$set: {TLic: req.files['TLIC'][0].filename, Lic: req.files['LIC'][0].filename, CMRLic: req.files['CMRLIC'][0].filename }}).then(createdDocs => {
    res.status(201).json(createdDocs);
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating a doc failed!"
    });
  });
};

exports.sendPhoneCode = (req, res, next) => {
  var randomString = randomstring.generate(5);
  var phoneVerificationCode = new PhoneCode(
    { userId: req.userData.userId, phoneVerificationCode: randomString }
  );
  phoneVerificationCode.save().then(() => {
    client.messages
    .create({
      body: 'Your phone code is:' + randomString,
      from: '+16179413428',
      to: req.userData.dialCode + req.userData.telephone
    })
  }).then(result => {
    res.status(201).json({
      message: "Code sent",
      result: result
    });
  })
  .catch(err => {
    res.status(500).json({
      message: "DB error!"
    });
  });
}

exports.verifyPhoneCode = function (req, res, next) {
  PhoneCode.findOne({phoneVerificationCode: req.body.phoneCode}, function(err, phoneVerificationCode) {
    if(!phoneVerificationCode) {
      return res.status(400).send({ message: 'We were unable to find a valid token. Your token my have expired.' });
    }
    User.findOne({ _id: phoneVerificationCode._userId }, function(err, user) {
      if (!user) return res.status(400).send({ message: 'We were unable to find a user for this token.' });
      if (user.isTelephoneVerified) return res.status(400).send({ type: 'not-verified', message: 'This user has already been verified.' });
      user.isTelephoneVerified = true;
      user.save(function(err) {
        if(err) {
          { return res.status(500).send({ message: 'DB error!' }); }
        }
        else {
          res.status(201).json({
            message: "User updated!",
            result: user
          });
        }
      });
    });
  });
}

exports.inviteUser = (req, res, next) => {
  var inviteCode = randomstring.generate(30);
  const invitation = new Invitation({
    email: req.body.email,
    userId: req.userData.userId,
    inviteCode: inviteCode
  });
  invitation
  .save().then(()=> {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: 'nikola.balog@gmail.com', pass: '6hrhjJrhc8' }
    });
    var mailOptions = {
      from: 'no-reply@rasingo.com',
      to: req.body.email,
      subject: 'Rasingo Invitation',
      text: ' Tvoj poslovni partner ' + req.userData.companyName + 'poziva te na korištenje Rasingo platforme. Prvih 30 dana kompletno besplatno. Ne samo da je besplatno, već će i Vaš partner uživati u dodatnih, besplatnih mjesec dana, ukoliko postanete Rasingo korisnik. Pridruži te nam se, nećete požaliti. Nakon Vaše registracije, također možete pozvati svoje partnere koji još nisu korisnici Rasingo platforme te tako osigurati dodatne besplatne dane za Vaše osobno poslovanje. Klikni na:\n' +
       'http://localhost:4200/auth/signupStep0\/?inviteCode=' + inviteCode + '.\n'
    };
    transporter.sendMail(mailOptions)
  })
  .then(result => {
    res.status(201).json({
      message: "Invitation created!",
      result: result
    });
  })
  .catch(err => {
    res.status(500).json({
      message: "DB error!"
    });
  });
}

exports.editPassword = (req, res, next) => {
  User.findOne({ _id: req.userData.userId })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      return bcrypt.compare(req.body.oldPassword, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Wrong password"
        });
      } else {
        bcrypt.hash(req.body.newPassword, 10, function(err, hash) {
          User.findOneAndUpdate({_id: req.userData.userId}, {$set: {password: hash}}).then(result => {
            res.status(201).json({
              message: "User updated!",
              result: result
            });
          });
        });
      }
    })
    .catch(err => {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
}

exports.sendForgotCode = (req, res, next) => {
  User.findOne({email: req.body.email}, function(err, user) {
    console.log(user._id);
    var randomString = randomstring.generate(30);
    var passwordCode = new PasswordCode(
      { passwordVerificationCode: randomString,
        userId: user._id
      }
    );
    passwordCode.save().then(() => {
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: 'nikola.balog@gmail.com', pass: '6hrhjJrhc8' }
      });
      var mailOptions = {
        from: 'no-reply@rasingo.com',
        to: req.body.email,
        subject: 'Change password link',
        text: 'Hello,\n\n' + 'Please click the link: \nhttp:\/\/' + 'localhost:4200' + '\/changeForgottenPassword\/?passwordVerificationCode=' + passwordCode.passwordVerificationCode + '.\n'
      };
      transporter.sendMail(mailOptions)
    }).then(result => {
      res.status(201).json({
        message: "Code sent",
        result: result
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "DB error!"
      });
    });
  });
}

exports.changeForgottenPassword = function (req, res, next) {
  console.log("ušel sam");
  PasswordCode.findOne({passwordVerificationCode: req.body.passwordVerificationCode}, function(err, passwordVerificationCode) {
    if(!passwordVerificationCode) {
      return res.status(400).send({ message: 'We were unable to find a valid token. Your token my have expired.' });
    } else {
      bcrypt.hash(req.body.newPassword, 10, function(err, hash) {
        User.findOneAndUpdate({_id: passwordVerificationCode.userId}, {$set: {password: hash}}).then(result => {
          res.status(201).json({
            message: "Password updated",
            result: result
          });
        }).catch(err => {
          res.status(500).json({
            message: "DB error!"
          });
        });
      });
    }
  });
}

exports.contact = (req, res, next) => {
  console.log("počeo");
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'nikola.balog@gmail.com', pass: '6hrhjJrhc8' }
  });
  var mailOptions = {
    from: 'no-reply@rasingo.com',
    to: 'nbdiekatze@hotmail.com',
    subject: 'Message from Rasingo form',
    text: 'Name:' + req.body.name + '\n\nEmail:' + req.body.email + '\n\nMesssage:\n' + req.body.message
  };
  transporter.sendMail(mailOptions).then(result => {
    res.status(201).json({
      message: "Mail sent",
      result: result
    });
  })
  .catch(err => {
    res.status(500).json({
      message: "Sending mail failed"
    });
  });
}


/*Admin*/
exports.getUsers = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const userQuery = User.aggregate([
    {
    $lookup: {
      from: Docs.collection.name,
      localField: "_id",
      foreignField: "userId",
      as: "user_docs"
    }
  },
  {
    $lookup: {
      from: Truck.collection.name,
      localField: "_id",
      foreignField: "userId",
      as: "user_trucks"
    }
  },
  { $sort : {regDate : -1 }}
  ]);
  let fetchedUsers;
  if (pageSize && currentPage) {
    userQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  userQuery
    .then(documents => {
      fetchedUsers = documents;
      return User.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Users fetched successfully!",
        users: fetchedUsers,
        maxUsers: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching users failed!"
      });
    });
};

exports.downloadFile = (req, res) => {
  const file = `backend/docs/${req.params.name}`;
  res.download(file);
}

exports.approve = (req, res, next) => {
  const user = new User({
    _id: req.params.id,
    approved: req.body.approved
  });
  User.updateOne({ _id: req.params.id}, user).then(result => {
    res.status(201).json({
      message: "User updated!",
      result: result
    });
  })
  .catch(err => {
    res.status(500).json({
      message: "DB error!"
    });
  });
}

exports.addNewsletterEmail = (req, res, next) => {
  console.log(req.body.email);
  const newsletter = new Newsletter({
    email: req.body.email,
    date: Date("YYYY-mm-dd")
  });
  newsletter.save().then(result => {
    res.status(201).json({
      message: "Email added",
      result: result
    });
  }).catch(err => {
    res.status(500).json({
      message: "DB error!"
    });
  });;
}
