import express from "express";
import { login, logout, register,getUser } from "../controllers/userController.js";
import { isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout",isAuthorized, logout); // Logout should be accessible without isAuthorized
router.get("/getuser", isAuthorized, getUser);

  
export default router;
