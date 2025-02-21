import express from "express";
import auth from "../middleware/authentication.js";
import {
  getAllHistorys,
  getHistoryById,
} from "../controllers/historyController.js";
// memanggil controller history
const router = express.Router();

// ENDPOINT API

// GET DATA
router.get("/history", getAllHistorys);
router.get("/history/users/:id_pred", auth, getHistoryById);
// Delete DATA

export default router;
