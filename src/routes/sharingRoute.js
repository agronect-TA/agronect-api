import express from "express";
import auth from "../middleware/authentication.js";
import {
  postSharing,
  getAllSharing,
  getSharingById,
  getSharingByUserId,
  updateSharing,
  deleteSharing,
} from "../controllers/sharingController.js";
import { upload } from "../middleware/upload.js";
import verifyOwnership from "../middleware/verifySharing.js";

const router = express.Router();

router.post("/sharing", auth, upload.single("imgUrl"), postSharing);
router.get("/sharing", auth, getAllSharing);
router.get("/sharing/:sharing_id", auth, getSharingById);
router.get("/sharing/users/:user_id", auth, getSharingByUserId); // Add this route
router.put(
  "/sharing/:sharing_id",
  auth,
  verifyOwnership,
  upload.single("imgUrl"),
  updateSharing
);
router.delete("/sharing/:sharing_id", auth, verifyOwnership, deleteSharing);

export default router;
