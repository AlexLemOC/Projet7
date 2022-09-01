"use strict";

// Middleware Imports
const express = require("express");
const router = express.Router();
//standalone pour réduire les attaques brute-force
const bouncer = require("express-bouncer")(10000, 900000);

// Controller
const userCtrl = require("../controllers/login");

//=================================================================

// Login User Route protégé par bouncer
router.post("/", bouncer.block, userCtrl.login);

// Execution
module.exports = router;