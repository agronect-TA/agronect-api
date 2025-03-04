import express from "express";
import auth from "../middleware/authentication.js";
import {
  postSharing,
  getAllSharing,
  getSharingById,
  getSharingByUserId,
} from "../controllers/sharingController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/sharing", auth, upload.single("imgUrl"), postSharing);
router.get("/sharing", auth, getAllSharing);
router.get("/sharing/:sharing_id", auth, getSharingById);
router.get("/sharing/users/:user_id", auth, getSharingByUserId); // Add this route

export default router;
