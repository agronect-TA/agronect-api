import express from "express";
import {
  getAllHistorys,
  getHistoryById,
} from "../controllers/historyController.js";
// memanggil controller history
const router = express.Router();

// ENDPOINT API

// GET DATA
router.get("/history", getAllHistorys);
router.get("/history/users/:id_pred", getHistoryById);
// Delete DATA

export default router;
