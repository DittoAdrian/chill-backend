import express from "express";
import {
  getAllUsers,
  getUserById,
  createNewUser,
  UpdateUserData,
  deleteUser,
  loginUser,
  registerUser,
  verifikasiUser,
} from "../controllers/userController.js";

import { getVerifCode } from "../repositories/userRepository.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createNewUser);
router.patch("/users/:id", UpdateUserData);
router.delete("/users/:id", deleteUser);

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/verifikasi", verifikasiUser);

router.get("/testing", getVerifCode);

export default router;
