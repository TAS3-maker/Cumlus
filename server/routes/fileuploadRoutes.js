const express = require("express");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mongoose = require("mongoose");
const multer = require("multer");
const { Folder, File } = require("../models/userUpload");
require("dotenv").config();
const { encryptField, decryptField } = require("../utilities/encryptionUtils");
const { authenticateToken } = require("../routes/userRoutes");
const router = express.Router();
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const upload = multer();


router.post("/create-folder", authenticateToken, async (req, res) => {
  const { folder_name } = req.body;
  console.log("Decoded user_id from token:", req.user);  // Log decoded token object
  // Safely extract user_id from the decoded token
  const user_id = req.user ? req.user.user_id : null;  // Changed _id to user_id
  if (!user_id) {
    return res.status(401).json({ error: "User ID not found in token" });
  }
  if (!folder_name) {
    return res.status(400).json({ error: "Folder name is required" });
  }
  try {
    const aws_folder_key = `${user_id}/${folder_name}_${new mongoose.Types.ObjectId()}/`;
    const aws_folder_link = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${aws_folder_key}`;
    // Encrypt the folder name and link
    const encryptedFolderName = encryptField(folder_name);
    const encryptedFolderLink = encryptField(aws_folder_link);
    const newFolder = new Folder({
      user_id, // The extracted user_id from the token
      folder_name: encryptedFolderName.encryptedData,
      aws_folder_link: encryptedFolderLink.encryptedData,
      iv_folder_name: encryptedFolderName.iv,
      iv_folder_link: encryptedFolderLink.iv,
    });
    await newFolder.save();
    res.status(201).json({
      message: "Folder created successfully",
      folder: {
        user_id,
        folder_name,
        aws_folder_link,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating folder" });
  }
});

    

router.post("/upload-file", authenticateToken, upload.single("file"), async (req, res) => {
    const { folder_id, tags } = req.body; // Folder ID selected by the user, and tags input by the user
    const file = req.file;
    // Extract user_id from the decoded token (since authenticateToken already sets req.user)
    const user_id = req.user ? req.user.user_id : null; // Get user_id from token
    if (!user_id) {
      return res.status(401).json({ error: "User ID not found in token" });
    }
    if (!folder_id) {
      return res.status(400).json({ error: "Folder ID is required" });
    }
    try {
      // Find the folder by ID (validate if it exists and belongs to the user)
      const folder = await Folder.findById(folder_id);
      if (!folder) {
        return res.status(404).json({ error: "Folder not found" });
      }
      // Check if the folder belongs to the current user
      if (folder.user_id.toString() !== user_id.toString()) {
        return res.status(403).json({ error: "You do not have permission to upload files to this folder" });
      }
      // Generate AWS S3 file key and link
      const aws_file_key = `${user_id}/${folder.folder_name}_${folder._id}/${file.originalname}`;
      const aws_file_link = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${aws_file_key}`;
      // Encrypt the file link and name
      const encryptedFileLink = encryptField(aws_file_link);
      const encryptedFileName = encryptField(file.originalname);
      // Prepare the parameters for uploading the file to S3
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: aws_file_key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ServerSideEncryption: "AES256",
      };
      const command = new PutObjectCommand(params);
      await s3.send(command); // Upload the file to S3
      // Create a new file entry in the database with tags
      const newFile = new File({
        user_id, // From the token
        folder_id, // From the request body
        file_name: encryptedFileName.encryptedData, // Encrypted file name
        aws_file_link: encryptedFileLink.encryptedData, // Encrypted file link
        iv_file_name: encryptedFileName.iv, // IV for file name encryption
        iv_file_link: encryptedFileLink.iv, // IV for file link encryption
        tags: tags || [], // Add the tags, default to an empty array if not provided
      });
      await newFile.save(); // Save the file to the database
      // Respond with success
      res.status(201).json({
        message: "File uploaded successfully",
        file: {
          user_id,
          folder_id,
          file_name: file.originalname,
          aws_file_link, // Return the raw AWS S3 file link
          tags, // Return the tags that were added
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error uploading file" });
    }
  });
  
router.get("/get-folders", authenticateToken, async (req, res) => {
    try {
      const user_id = req.user.user_id; // Extracted from token
      // Fetch all folders for the user
      const folders = await Folder.find({ user_id: user_id });
      // Decrypt folder names and links
      const decryptedFolders = folders.map(folder => {
        const folderName = decryptField(folder.folder_name, folder.iv_folder_name);
        const folderLink = decryptField(folder.aws_folder_link, folder.iv_folder_link);
        return {
          ...folder.toObject(),
          folder_name: folderName,
          aws_folder_link: folderLink
        };
      });
      res.status(200).json(decryptedFolders);
    } catch (error) {
      console.error("Error retrieving folders:", error);
      res.status(500).json({ message: "Error retrieving folders.", error: error.message });
    }
  });
  router.post("/get-files", authenticateToken, async (req, res) => {
    try {
      const user_id = req.user.user_id;
      const { folder_id } = req.body;
      if (!folder_id) {
        return res.status(400).json({ message: "Folder ID is required." });
      }
      const folder = await Folder.findOne({ _id: folder_id, user_id: user_id });
      if (!folder) {
        return res.status(404).json({ message: "Folder not found or access denied." });
      }
       const folderName = decryptField(folder.folder_name, folder.iv_folder_name);
      const files = await File.find({ folder_id: folder_id });
      const decryptedFiles = files.map(file => {
        const fileName = decryptField(file.file_name, file.iv_file_name);
        const fileLink = decryptField(file.aws_file_link, file.iv_file_link);
        return {
          ...file.toObject(),
          folder_name: folderName,
          file_name: fileName,
          aws_file_link: fileLink,
        };
      });
      res.status(200).json(decryptedFiles);
    } catch (error) {
      console.error("Error retrieving files:", error);
      res.status(500).json({ message: "Error retrieving files.", error: error.message });
    }
  });
  module.exports = router;
  
  
  
  
  
  
  
  
  




