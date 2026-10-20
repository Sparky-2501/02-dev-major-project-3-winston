const express = require("express");
const router = express.Router();
const {body} = require("express-validator");
const captainController = require("../controllers/captain.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/register", [
  body("fullname.firstname").notEmpty().withMessage("First name is required").isLength({ min: 3 }).withMessage("First name must be at least 3 characters long"),
  body("fullname.lastname").optional().isLength({ min: 3 }).withMessage("Last name must be at least 3 characters long"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("vehicle.color").notEmpty().withMessage("Vehicle color is required").isLength({ min: 3 }).withMessage("Color must be at least 3 characters long"),
  body("vehicle.plate").optional().isLength({ min: 3 }).withMessage("Plate must be at least 3 characters long"),
  body("vehicle.capacity").notEmpty().withMessage("Vehicle capacity is required").isInt({ min: 1 }).withMessage("Capacity must be at least 1"),
  body("vehicle.vehicleType").notEmpty().withMessage("Vehicle type is required").isIn(["car", "auto", "motorcycle"]).withMessage("Invalid vehicle type"),
],captainController.registerCaptain);


router.post("/login", [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
], captainController.loginCaptain);


router.get("/profile", authMiddleware.authCaptain, captainController.getCaptainProfile);


//logout route
router.post("/logout", authMiddleware.authCaptain, captainController.logoutCaptain);
module.exports = router;
