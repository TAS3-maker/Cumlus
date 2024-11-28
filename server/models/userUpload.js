11
const mongoose = require("mongoose");

const FolderSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    folder_name: {
      type: String,
      required: true,
    },
    iv_folder_name: {
      type: String,
      required: true,
    },
    aws_folder_link: {
      type: String,
      required: true,
    },
    iv_folder_link: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  });
  const FileSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    folder_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
    },
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
    sharing_contacts: [
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        shared_on: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tags: {
      type: [String],
      default: [],
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  });
  const Folder = mongoose.model("Folder", FolderSchema);
  const File = mongoose.model("File", FileSchema);
  module.exports = { Folder, File };
  
  
  
  
  
  
  
  
  
  
  
  
  