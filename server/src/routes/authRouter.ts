import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshToken,
} from "../controllers/authController";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/refresh", refreshToken);
router.post("/logout", logoutUser);

export default router;
