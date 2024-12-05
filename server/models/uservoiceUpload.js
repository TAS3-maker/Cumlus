const mongoose = require("mongoose");
const VoiceSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  voice_name: {
    type: String,
    required: true,
  },
  duration: {
    type: Number
    // required: true,
  },
  file_size: {
    type: Number, 
    required: true,
  },
  aws_file_link: {
    type: String, 
    required: true,
  },
  iv_file_link: {
    type: String, 
    required: true,
  },
  iv_voice_name: {
    type: String, 
    required: true,
  },
  date_of_upload: {
    type: Date,
    default: Date.now,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Voice", VoiceSchema);