import express from "express";
import auth from "../middleware/authentication.js";
import {
  postSharing,
  getAllSharing,
} from "../controllers/sharingController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/sharing", auth, upload.single("imgUrl"), postSharing);
router.get("/sharing", auth, getAllSharing);

export default router;
