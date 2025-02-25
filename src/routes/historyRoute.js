import express from "express";
import {
  getAllHistorys,
  getHistoryById,
  getHistoryByUserId,
  deleteHistory,
} from "../controllers/historyController.js";

import auth from "../middleware/authentication.js";
// memanggil controller history
const router = express.Router();

// ENDPOINT API

// GET DATA
router.get("/history", auth, getAllHistorys);
router.get("/history/users/:id_pred", auth, getHistoryById);
router.get("/history/:user_id", auth, getHistoryByUserId);
router.delete("/history/users/:id_pred", auth, deleteHistory);

// Delete DATA

export default router;
