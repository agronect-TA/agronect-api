import express from "express";
import {
  getAllHistorys,
  getHistoryById,
  getHistoryByUserId,
  deleteHistory,
} from "../controllers/historyController.js";

import auth from "../middleware/authentication.js";
const router = express.Router();

// ENDPOINT API

router.get("/history", auth, getAllHistorys);
router.get("/history/:id_pred", auth, getHistoryById);
router.get("/history/users/:user_id", auth, getHistoryByUserId);
router.delete("/history/:id_pred", auth, deleteHistory);

export default router;
