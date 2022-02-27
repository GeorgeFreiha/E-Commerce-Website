"use strict";
const express = require("express");
let router = express.Router();
const User = require("../data-models/user");
const Product = require("../data-models/product");
const bcrypt = require("bcrypt");
const salt = 10;
let currentResult = null;
router.get("/", (req, res) => {
  res.render("admin-panel");
});

router.get("/api/all-users", (req, res) => {
  User.find()
    .select("name -_id type")
    .then((result) => {
      res.send(result);
    });
});
router.get("/add-admin", (req, res) => {
  res.render("add-admin");
});

router.post("/add-admin", (req, res) => {
  if (req.body.pass == req.body.re_pass) {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.pass,
      type: "ADMIN",
      cart: {},
    });

    bcrypt.hash(user.password, salt, function (err, hash) {
      user.password = hash;
      user.save().then((result) => {
        res.render("add-admin");
      });
    });
  } else {
    res.render("add-admin");
  }
});

// bcrypt.hash(user.password, salt, function (err, hash) {
//     user.password = hash;
//     console.log(user.password);
//     user.save().then((result) => {
//       console.log(result);
//       res.render("signin");
//     });

router.get("/api/products", (req, res) => {
  Product.find()
    .select("name -_id price")
    .then((result) => {
      res.send(result);
    });
});
//Modify products
router.get("/modify-products", (req, res) => {
  res.render("modify-products", { account: currentResult });
});

router.post("/modify-products", (req, res) => {
  console.log(parseInt(req.body.price));
  console.log(req.body.name);
  console.log(req.body);
  const product = new Product({
    name: req.body.name,
    type: req.body.type,
    price: parseInt(req.body.price),
    image: req.body.image,
  }).save();
});

router.get("/modify-products/delete", (req, res) => {
  console.log(req.query.name);
  Product.findOneAndDelete({ name: req.query.name }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted User : ", docs);
    }
  });
});

router.get("/modify-products/modify-price", (req, res) => {
  console.log(req.query.name);
  console.log(parseInt(req.query.price));
  Product.findOneAndUpdate(
    { name: req.query.name },
    { price: parseInt(req.query.price) },
    {
      new: true,
    },
    (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }

      console.log(doc);
    }
  );
});
module.exports = router;
