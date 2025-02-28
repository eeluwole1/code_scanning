import express from "express";
import rateLimit from "express-rate-limit";
import { setCustomClaims } from "../controllers/adminController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: express.Router = express.Router();

// Define rate limiter: Max 5 requests per minute per IP
const adminRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per minute
  message: "Too many requests, please try again later.",
  headers: true, // Include rate limit info in headers
});

/**
 * @route POST /setCustomClaims
 * @description Set custom claims for a user.
 * @security Admin role required.
 */
router.post(
  "/setCustomClaims",
  adminRateLimiter, // Apply rate limiting middleware
  authenticate,
  isAuthorized({ hasRole: ["admin"] }),
  setCustomClaims
);

export default router;
