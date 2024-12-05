const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Role, SecurityQuestion, Userlogin, UserQuestion } = require("../models/userModel");
const crypto = require('crypto');
const { generateOTP, sendEmail } = require('../email/emailUtils')
const router = express.Router();
const otpStore = new Map();

const JWT_SECRET = crypto.randomBytes(64).toString('hex');
const REFRESH_TOKEN_SECRET = crypto.randomBytes(64).toString('hex');


router.post("/create-question", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "The 'question' field is required." });
  }

  try {
    const newQuestion = new SecurityQuestion({ question });
    await newQuestion.save();
    res.status(201).json({ message: "Security question created successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating security question." });
  }
});

function generateAccessToken(user) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '15m' });  // Access token expires in 15 minutes
}

// Helper function to generate refresh token
function generateRefreshToken(user) {
  return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });  // Refresh token expires in 7 days
}

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // Generate OTP
    const otp = generateOTP();

    // Set OTP expiration time (e.g., 5 minutes)
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now

    // Store OTP in the otpStore with expiration
    otpStore.set(email, { otp, expiresAt });
    console.log("Stored OTP for email:", email, otpStore.get(email));

    // Send OTP via email
    const emailResponse = await sendEmail(email, otp);

    if (emailResponse.success) {
      res.status(200).json({
        message: "OTP sent successfully.",
        otp, // For testing only; do not expose in production
        previewURL: emailResponse.previewURL,
      });
    } else {
      res.status(500).json({ message: "Error sending OTP email.", error: emailResponse.error });
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Error generating or sending OTP.", error: error.message });
  }
});


router.post("/confirm-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    console.error("Email or OTP missing.");
    return res.status(400).json({ message: "Email and OTP are required." });
  }

  try {
    console.log("Looking for OTP for email:", email);
    const storedOtp = otpStore.get(email);
    console.log("Stored OTP details:", storedOtp);

    if (!storedOtp) {
      console.error("OTP not found for email:", email);
      return res.status(400).json({ message: "OTP not found or expired." });
    }

    if (Date.now() > storedOtp.expiresAt) {
      console.error("OTP expired for email:", email);
      otpStore.delete(email); // Remove expired OTP
      return res.status(400).json({ message: "OTP expired." });
    }

    if (storedOtp.otp !== otp) {
      console.error("Invalid OTP for email:", email);
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // OTP is valid, remove it from the store
    otpStore.delete(email);
    console.log("OTP verified successfully for email:", email);

    // Further actions (e.g., account verification, password reset, etc.)
    res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("Error confirming OTP:", error);
    res.status(500).json({ message: "Error confirming OTP.", error: error.message });
  }
});


// Example backend route for checking phone number
router.post('/check-phone', async (req, res) => {
  const { phoneNumber } = req.body;
  try {
      // Query to check if the phone number exists in the collection
      const existingUser = await Userlogin.findOne({ phoneNumber });

      if (existingUser) {
          return res.status(200).json({ message: "Phone number already registered." });
      } else {
          return res.status(200).json({ message: "Phone number is available." });
      }
  } catch (error) {
      console.error("Error checking phone number:", error);
      res.status(500).json({ message: "Error checking phone number.", error: error.message });
  }
});

router.post('/token', (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
  }

  // Verify the refresh token
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
          return res.status(403).json({ message: 'Invalid refresh token' });
      }

      // Generate new access token
      const accessToken = generateAccessToken({ username: decoded.username });

      res.json({ accessToken });
  });
});


  // POST API to add a role
router.post("/add-roles", async (req, res) => {
  try {
    const { roleName } = req.body;

   
    const existingRole = await Role.findOne({ roleName });
    if (existingRole) {
      return res.status(400).json({ message: "Role already exists" });
    }

    
    const role = new Role({ roleName });
    await role.save();

    res.status(201).json({ message: "Role created successfully", role });
  } catch (error) {
    res.status(500).json({ message: "Error creating role", error: error.message });
  }
});

router.get("/security-questions", async (req, res) => {
  try {
    // Fetch all security questions
    const questions = await SecurityQuestion.find();

    // Check if questions are found
    if (questions.length === 0) {
      return res.status(404).json({ message: "No security questions found." });
    }

    // Send response with questions
    res.status(200).json({ questions });
  } catch (error) {
    console.error("Error fetching security questions:", error);
    res.status(500).json({ message: "Error fetching security questions", error: error.message });
  }
});


  // Middleware to authenticate token
  function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token after 'Bearer'
    if (!token) return res.status(401).json({ message: 'Token not provided' });
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = decoded; // Attach decoded token data (including user_id) to the request object
        next(); // Proceed to the next middleware or route handler
    });
}

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await Userlogin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Fetch the default 'User' role from the Role collection
    const defaultRole = await Role.findOne({ roleName: "User" });
    if (!defaultRole) {
      return res.status(400).json({ message: "Default 'User' role not found" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new Userlogin({
      username,
      email,
      password: hashedPassword,
      roles: [
        {
          role_id: defaultRole._id,
          roleName: defaultRole.roleName,
        },
      ],
      questions: false, // Initially set to false
    });

    // Save the new user
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: { username, email, questions: newUser.questions },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Error during signup", error: error.message });
  }
});


// POST Route for User Login
// Route for user login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Userlogin.findOne({ email }).populate("roles.role_id");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const questionExists = await UserQuestion.exists({ user_id: user._id });

    // Generate the access token
    const accessToken = jwt.sign({ user_id: user._id }, JWT_SECRET, { expiresIn: "15m" });

    // Generate the refresh token
    const refreshToken = jwt.sign({ user_id: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    // Send the refresh token as an HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set secure cookie in production
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days expiration
    });

    res.status(200).json({
      message: "Login successful.",
      accessToken,
      user: {
        user_id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles.map((role) => ({
          role_id: role.role_id._id,
          roleName: role.role_id.roleName,
        })),
        questions: !!questionExists,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error during login", error: error.message });
  }
});



router.post("/set-questions", async (req, res) => {
  const { userId, securityAnswers } = req.body;

  try {
    // Find the user by userId
    const user = await Userlogin.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Validate and save security answers
    const validAnswers = [];
    for (const answer of securityAnswers) {
      const question = await SecurityQuestion.findById(answer.question_id);
      if (!question) {
        return res.status(400).json({ message: `Invalid question ID: ${answer.question_id}` });
      }
      validAnswers.push({ question_id: question._id, answer: answer.answer });
    }

    if (validAnswers.length > 0) {
      // Save UserQuestion data
      await UserQuestion.create({
        user_id: user._id,
        questions: validAnswers,
      });

      // Update user's `questions` field
      user.questions = true;
      await user.save();

      res.status(200).json({ message: "Security questions answered successfully" });
    } else {
      res.status(400).json({ message: "No valid answers provided" });
    }
  } catch (error) {
    console.error("Error during setting questions:", error);
    res.status(500).json({ message: "Error during setting questions", error: error.message });
  }
});

router.post("/update-phone", async (req, res) => {
  const { email, phoneNumber } = req.body;
  console.log("Received request payload:", req.body); // For debugging

  try {
    // Check if the phone number already exists
    const existingUserWithPhone = await Userlogin.findOne({ phoneNumber });
    if (existingUserWithPhone) {
      console.log("Phone number already registered:", phoneNumber); // Debugging
      return res.status(400).json({ message: "This phone number is already registered." });
    }

    // Find the user by email
    const user = await Userlogin.findOne({ email });
    if (!user) {
      console.log("User not found with email:", email); // Debugging
      return res.status(404).json({ message: "User not found with this email." });
    }

    // Update the phone number
    user.phoneNumber = phoneNumber;
    await user.save();

    console.log("Phone number updated for user:", email); // Debugging
    res.status(200).json({ message: "Phone number updated successfully." });
  } catch (error) {
    console.error("Error updating phone number:", error);
    res.status(500).json({ message: "Error updating phone number.", error: error.message });
  }
});








// POST Route for Updating Password
router.post("/update-password", async (req, res) => {
  const { email, newPassword } = req.body;
  console.log("Phone number already registered:", newPassword,email); // Debugging
  try {
    
    const user = await Userlogin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Error updating password", error: error.message });
  }
});
router.get("/get-user", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await Userlogin.findOne({ email });

    if (user) {
      return res.status(200).json({ user });
    } else {
      return res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Error fetching user data.", error: error.message });
  }
});





module.exports = { router, authenticateToken };