const express = require("express");
const { handleCreateStore,handleGetStore } = require("../controllers/storeController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authenticateToken, handleCreateStore);
router.get("/get/:userId", authenticateToken, handleGetStore);

module.exports = router;
