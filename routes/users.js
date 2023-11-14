var express = require('express');
var router = express.Router();
var jsend = require('jsend');
var crypto = require("crypto");

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var db=require('../models')
var UserService = require("../services/userService");
var userService = new UserService(db);
var jwt = require('jsonwebtoken');

router.use(jsend.middleware);
require('dotenv').config();

// Post for registered users to be able to login
router.post("/login", jsonParser, async (req, res, next) => {
	const { email, password } = req.body;
	if (email == null) {
	  return res.jsend.fail({ email: "Email is required." });
	}
	if (password == null) {
	  return res.jsend.fail({ password: "Password is required." });
	}
	userService.getOne(email).then((data) => {
	  if (data === null) {
		return res.jsend.fail({ result: "Incorrect email or password" });
	  }
	  crypto.pbkdf2(
		password,
		data.salt,
		310000,
		32,
		"sha256",
		function (err, hashedPassword) {
		  if (err) {
			return cb(err);
		  }
		  if (!crypto.timingSafeEqual(data.encryptedPassword, hashedPassword)) {
			return res.jsend.fail({ result: "Incorrect email or password" });
		  }
		  let token;
		  try {
			token = jwt.sign(
			  { id: data.id, email: data.email },
			  process.env.TOKEN_SECRET,
			  { expiresIn: "5h" }
			);
		  } catch (err) {
			res.jsend.error("Something went wrong with creating JWT token");
		  }
		  res.jsend.success({
			result: "You are logged in",
			id: data.id,
			email: data.email,
			token: token,
		  });
		}
	  );
	});
  });

// Post for new users to register / signup

router.post("/signup", async (req, res, next) => {
	const { name, email, password } = req.body;
	if (name == null) {
	  return res.jsend.fail({ name: "Name is required." });
	}
	if (email == null) {
	  return res.jsend.fail({ email: "Email is required." });
	}
	if (password == null) {
	  return res.jsend.fail({ password: "Password is required." });
	}
	var user = await userService.getOne(email);
	if (user != null) {
	  return res.jsend.fail({ email: "Provided email is already in use." });
	}
	var salt = crypto.randomBytes(16);
	crypto.pbkdf2(
	  password,
	  salt,
	  310000,
	  32,
	  "sha256",
	  function (err, hashedPassword) {
		if (err) {
		  return next(err);
		}
		userService.create(name, email, hashedPassword, salt);
		res.jsend.success({ result: "You created an account." });
	  }
	);
  });
  

router.get('/fail', (req, res) => {
	return res.status(401).jsend.error({ statusCode: 401, message: 'message', data: 'data' });
});

router.post('/delete', async (req, res) => {
	const {id}=req.body
	await userService.deleteUser(id)
})

module.exports = router;

