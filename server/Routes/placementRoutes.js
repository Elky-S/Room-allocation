const express = require("express");
const router = express.Router();
const placementController = require("../controller/placementController");

// ניתובים כלליים
router.get("/", placementController.getAllPlacements);
router.post("/", placementController.createPlacement);

// ניתובים למחיקה
router.delete("/all", placementController.deleteAllPlacements);
router.delete("/day/:day", placementController.deleteByDay);
router.delete("/:id", placementController.deletePlacement);

// ניתוב לחישוב שעות פנויות
router.get("/free/:day", placementController.getFreeSlots);

module.exports = router;
