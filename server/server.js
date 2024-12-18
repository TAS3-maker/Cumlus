const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const { router: userRoutes } = require('./routes/userRoutes');
const fileuploadRoutes = require("./routes/fileuploadRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const voiceuploadRoutes = require("./routes/voiceuploadRoutes");
const defaultfileRoutes = require("./routes/defaultfileRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://51.20.135.111:3000', // Adjust as per your frontend URL
  credentials: true, // Allow cookies to be sent with requests
}));

// Configure express-session
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
}));

app.use("/api/auth", userRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api", fileuploadRoutes);
app.use("/api/voice-memo", voiceuploadRoutes);
app.use("/api/default", defaultfileRoutes);

const DB_URI = process.env.DB_URI;
mongoose
  .connect(DB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
