const User = require("../models/user");
const asyncHandler = require("express-async-handler");

// Fetch all users.
exports.user_list = asyncHandler(async (req, res, next) => {
  // Fetch users from database and send
});

// Fetch specific user details.
exports.user_detail = asyncHandler(async (req, res, next) => {
  // Fetch user details from database using req.params.id and send
});

// Create a new user.
exports.user_create = asyncHandler(async (req, res, next) => {
  // Create a new user in the database using information in req.body and send confirmation
});

// Update a specific user's details.
exports.user_update = asyncHandler(async (req, res, next) => {
  // Update user in the database using req.params.id and info in req.body, then send confirmation
});

// Delete a specific user.
exports.user_delete = asyncHandler(async (req, res, next) => {
  // Delete user from database using req.params.id and send confirmation
});