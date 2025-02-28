import express, { Router } from "express";
import rateLimit from "express-rate-limit";
import * as itemController from "../controllers/itemController";
import { validateRequest } from "../middleware/validate";
import { itemSchema, deleteItemSchema } from "../validation/itemValidation";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

// Create an express Router instance
const router: Router = express.Router();

// Define rate limiter: Max 5 delete requests per minute
const deleteLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 delete requests per windowMs
  message: "Too many delete requests from this IP, please try again later.",
  headers: true,
});

/**
 * @route DELETE /:id
 * @description Delete an item.
 * @security Admin or Manager role required.
 */
router.delete(
  "/:id",
  deleteLimiter, // Apply rate limiting middleware
  authenticate,
  isAuthorized({ hasRole: ["admin", "manager"] }),
  validateRequest(deleteItemSchema),
  itemController.deleteItem
);

export default router;
