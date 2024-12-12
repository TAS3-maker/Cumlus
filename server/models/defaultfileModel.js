const mongoose = require("mongoose");
const defaultFileSchema = new mongoose.Schema({
  file_name: {
    type: String,
    required: true,
  },
  iv_file_name: {
    type: String,
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
  date_of_upload: {
    type: Date,
    default: Date.now, 
  },
});
module.exports = mongoose.model("defaultFile", defaultFileSchema);
