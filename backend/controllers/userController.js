import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";


// Register user
export const register = catchAsyncError(async (req, res, next) => {
  let { name, email, phone, role, password } = req.body;
  console.log(req.body); // Log the request body for debugging

  // Normalize the role input to match the enum values
  role = role.trim();

  if (!name || !email || !phone || !role || !password) {
    return next(new ErrorHandler("Please fill the full registration form", 400));
  }

  // Check if the email already exists
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already exists", 400));
  }

  // Create a new user
  const user = await User.create({
    name,
    email,
    phone,
    role,
    password,
  });
});

// Login user
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email, password, and role.", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid password.", 400));
  }

  if (user.role !== role) {
    return next(new ErrorHandler("Invalid role.", 404));
  }

  sendToken(user, 201, res, "User logged in successfully");
});

// Logout user
export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "User logged out successfully",
    });
});

// Get user details
export const getUser = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});
