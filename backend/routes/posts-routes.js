"use strict";

// Middleware Imports
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// Controller
const postCtrl = require("../controllers/posts");

//=================================================================

// Create Posts Routes
router.post("/", auth, multer, postCtrl.createPost);
router.post("/reaction", auth, postCtrl.postReaction);

// Read Posts Routes
router.get("/", auth, postCtrl.getAllPosts);
router.get("/categories", auth, postCtrl.getCategories);
router.get("/most-liked", auth, postCtrl.getMostLikedPosts);
router.get("/:id", auth, postCtrl.getOnePost);

// Delete Posts Route
router.delete("/:id", auth, postCtrl.deletePost);

// Update Post Route
router.patch("/update", auth, multer, postCtrl.updatePost);

// Execution
module.exports = router;