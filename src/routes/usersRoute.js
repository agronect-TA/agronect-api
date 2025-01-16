import express from "express";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import {
  updateUserValidate,
  changePasswordValidate,
} from "../validation/usersValidation.js";

import auth from "../middleware/authentication.js";

import {
  updateUser,
  getUserById,
  getAllUsers,
  changePassword,
} from "../controllers/usersController.js";

const router = express.Router();

router.get("/users/:id", getUserById);
router.get("/users/", getAllUsers);

router.put(
  "/users/update-users/:id",
  auth,
  upload.single("imgUrl"),
  validate(updateUserValidate), // Validasi untuk data update user
  updateUser
);

router.put(
  "/users/change-password/:id",
  auth,
  validate(changePasswordValidate), // Validasi untuk data ganti password
  changePassword
);

export default router;
