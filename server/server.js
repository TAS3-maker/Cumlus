const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const { router: userRoutes } = require('./routes/userRoutes');
const fileuploadRoutes = require("./routes/fileuploadRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const voiceuploadRoutes = require("./routes/voiceuploadRoutes");

// const userRoutes =  require('./routes/userRoutes.js')
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());
// app.use(bodyParser.json());
app.use("/api/auth", userRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api", fileuploadRoutes);
app.use("/api/voice-memo", voiceuploadRoutes);
const DB_URI = 'mongodb+srv://cumulus545:techarch12@cumulus2024.ibscb.mongodb.net/?retryWrites=true&w=majority&appName=Cumulus2024';
mongoose
  .connect(DB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));