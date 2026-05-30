const express = require("express");
const router = express.Router();
const resourceController = require("../controllers/resourceController");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

// All resource routes require login + admin role
router.use(auth, adminOnly);

// GET    /api/resources
router.get("/", resourceController.getAll);

// GET    /api/resources/:id
router.get("/:id", resourceController.getOne);

// POST   /api/resources
router.post("/", resourceController.create);

// PUT    /api/resources/:id
router.put("/:id", resourceController.update);

// DELETE /api/resources/:id
router.delete("/:id", resourceController.remove);

module.exports = router;
