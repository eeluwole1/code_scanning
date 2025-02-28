import express from "express";
import rateLimit from "express-rate-limit";
import { setCustomClaims } from "../controllers/adminController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: express.Router = express.Router();

// Define rate limiter: Max 5 requests per minute per IP for security-sensitive admin operations
const adminRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 5, // Limit each IP to 5 requests per minute
  message: { error: "Too many requests, please try again later." }, // Custom response
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers (deprecated)
});

/**
 * @route POST /setCustomClaims
 * @description Set custom claims for a user (Admin only).
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
