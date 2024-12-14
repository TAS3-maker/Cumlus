const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");
const { S3, PutObjectCommand } = require('@aws-sdk/client-s3');
const { encryptField, decryptField } = require("../utilities/encryptionUtils"); 
const DefaultFile = require("../models/defaultfileModel"); 
const mime = require('mime-types');  // This imports the mime module

require("dotenv").config();
const s3 = new S3({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
// Setup Multer to handle file uploads (in-memory storage)
const upload = multer({ storage: multer.memoryStorage() });
// Route to upload a file to AWS S3 and store details in MongoDB
router.post("/default-file-upload", upload.single("file"), async (req, res) => {
    try {
      const { file_name } = req.body; // Only file_name is provided
  
      // Validate input
      if (!req.file || !file_name) {
        return res.status(400).json({ message: "File and file_name are required" });
      }
  
      // Set the folder path
      const userFolder = "defaultfolder"; // Default folder name
  
      // Generate AWS S3 file path using timestamp for uniqueness
      const s3FileName = `${Date.now()}_${file_name}`;
      const awsFileKey = `${userFolder}/${s3FileName}`;
      const awsFileLink = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${awsFileKey}`;
  
      // Encrypt the file link and name
      const encryptedFileLink = encryptField(awsFileLink);
      const encryptedFileName = encryptField(file_name);
  
      // Prepare the parameters for uploading the file to S3
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: awsFileKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ServerSideEncryption: "AES256",
        ACL: "public-read", // Adjust ACL as needed (public-read for public access)
      };
  
      // Upload the file to AWS S3 using PutObjectCommand
      await s3.send(new PutObjectCommand(params));
  
      // Store the file details in MongoDB using the defaultFileSchema
      const newFile = new DefaultFile({
        file_name: encryptedFileName.encryptedData,
        iv_file_name: encryptedFileName.iv,
        aws_file_link: encryptedFileLink.encryptedData, // Encrypted S3 URL
        iv_file_link: encryptedFileLink.iv,
        date_of_upload: Date.now(),
      });
  
      await newFile.save();
  
      res.status(201).json({
        message: "File uploaded successfully",
        file: {
          id: newFile._id,
          name: file_name,
          link: awsFileLink,
        },
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Error uploading file", error: error.message });
    }
  });
  router.get("/default-files", async (req, res) => {
    try {
      // Fetch all files from the DefaultFile collection
      const files = await DefaultFile.find();
  
      if (!files || files.length === 0) {
        return res.status(404).json({ message: "No files found." });
      }
  
      // Decrypt the file name and AWS file link for each file
      const decryptedFiles = files.map((file) => {
        const decryptedFileName = decryptField(file.file_name, file.iv_file_name);
        const decryptedFileLink = decryptField(file.aws_file_link, file.iv_file_link);
  
        return {
          _id: file._id,
          file_name: decryptedFileName,
          aws_file_link: decryptedFileLink,
          date_of_upload: file.date_of_upload,
        };
      });
  
      // Return the decrypted files
      res.status(200).json({
        message: "Files retrieved successfully",
        files: decryptedFiles,
      });
    } catch (error) {
      console.error("Error fetching files:", error);
      res.status(500).json({ message: "Error fetching files", error: error.message });
    }
  });
  // Route to get file details (name, URL, and MIME type)
  router.get("/view-file/:fileId", async (req, res) => {
    try {
      const { fileId } = req.params;
  
      // Fetch the file record from the DefaultFile collection using fileId
      const file = await DefaultFile.findById(fileId);
  
      if (!file) {
        return res.status(404).json({ message: "File not found." });
      }
  
      // Decrypt the file name and AWS file link
      const decryptedFileName = decryptField(file.file_name, file.iv_file_name);
      const decryptedFileLink = decryptField(file.aws_file_link, file.iv_file_link);
  
      // Get the MIME type based on the file extension
      const mimeType = mime.lookup(decryptedFileName) || 'application/octet-stream';
  
      // Construct the response
      const fileInfo = {
        _id: file._id,
        file_name: decryptedFileName,
        aws_file_link: decryptedFileLink,
        mime_type: mimeType,
        date_of_upload: file.date_of_upload,
      };
  
      // Optionally, you can fetch the file content from AWS if needed
      // const fileContent = await axios.get(decryptedFileLink, { responseType: 'arraybuffer' });
  
      res.status(200).json({
        message: "File retrieved successfully",
        file: fileInfo,
      });
    } catch (error) {
      console.error("Error retrieving file:", error);
      res.status(500).json({ message: "Error retrieving file", error: error.message });
    }
  });

  
module.exports = router;
