import express from "express";
import { body } from "express-validator";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

/**
 * @route POST /api/auth/signup
 * @desc Register a new user
 */
router.post(
  "/signup",
  [
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  signup
);

/**
 * @route POST /api/auth/login
 * @desc Authenticate user and get token
 */
router.post("/login", login);

export default router;
