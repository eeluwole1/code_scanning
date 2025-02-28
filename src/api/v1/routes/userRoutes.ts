import express, { Router } from "express";
import rateLimit from "express-rate-limit";
import { getUserDetails } from "../controllers/userController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

// Define rate limiter: Max 10 requests per minute per IP
const userRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per minute
  message: "Too many requests, please try again later.",
  headers: true, // Include rate limit info in headers
});

/**
 * @route GET /:id
 * @description Get user details.
 * @security Admin role required.
 */
router.get(
  "/:id",
  userRateLimiter, // Apply rate limiting middleware
  authenticate,
  isAuthorized({ hasRole: ["admin"] }),
  getUserDetails
);

export default router;
