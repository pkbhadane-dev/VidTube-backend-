import { body } from "express-validator";

export const registerValidation = [
  body("fullname")
    .notEmpty()
    .withMessage("Fullname is required")
    .bail()
    .isLength({ min: 2 })
    .withMessage("Fullname atleast 2 characters long")
    .matches(/^[A-Za-z]+$/)
    .withMessage("Fullname contains only alphabets"),

  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .bail()
    .isLength({ min: 2 })
    .withMessage("Username atleast 2 characters long"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password should 6 characters long")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password must have special character")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase")
    .matches(/[a-z]/)
    .withMessage("Password must contain a lowercase"),
];

export const loginValidation = [
  body("email").notEmpty().withMessage("Please enter valid email"),
  body("username").notEmpty().withMessage("Please enter valid username"),
  body("password").notEmpty().withMessage("Please enter valid password"),
];
