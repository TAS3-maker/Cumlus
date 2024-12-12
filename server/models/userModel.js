const mongoose = require("mongoose");

// Role Schema
const RoleSchema = new mongoose.Schema({
  roleName: { type: String, required: true, unique: true },
});

const Role = mongoose.model("Role", RoleSchema);

// Security Question Schema
const SecurityQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
});

const SecurityQuestion = mongoose.model("SecurityQuestion", SecurityQuestionSchema);

// User Question Schema (for storing questions and answers linked to users)
const UserQuestionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
  questions: [
    {
      question_id: { type: mongoose.Schema.Types.ObjectId, ref: "SecurityQuestion", required: true }, // Reference to SecurityQuestion
      answer: { type: String, required: true }, // User-provided answer
    },
  ],
});

const UserQuestion = mongoose.model("UserQuestion", UserQuestionSchema);

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, default: null },
  roles: [
    {
      role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
      roleName: { type: String, required: true },
    },
  ],
  questions: { type: Boolean, default: false }, // Dynamically updated to reflect whether answers exist in `UserQuestion`
});

const Userlogin = mongoose.model("User", UserSchema);

module.exports = { Role, SecurityQuestion, Userlogin, UserQuestion };