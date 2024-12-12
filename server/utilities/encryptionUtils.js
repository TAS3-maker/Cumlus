const crypto = require("crypto");
// AES algorithm and block size (IV length)
const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16; // AES block size is 16 bytes
// Define a fixed encryption key (32 bytes for AES-256)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "3eacbc92236d173210b616971597ebd3fb6a019b45c8067592ea6a7a6db29aab"; // 32-byte key
// Ensure the encryption key is exactly 32 bytes (256 bits)
if (ENCRYPTION_KEY.length !== 64) { // Hexadecimal representation of a 32-byte key has 64 hex characters
  throw new Error("Encryption key must be exactly 32 bytes (64 hex characters)!");
}
// Encrypt a field
const encryptField = (field) => {
  const iv = crypto.randomBytes(IV_LENGTH); // Generate random IV for each encryption
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, "hex"), iv); // Create cipher with the fixed key (Buffer)
  let encrypted = cipher.update(field, "utf8", "hex"); // Encrypt the field
  encrypted += cipher.final("hex"); // Final encryption step
  console.log("Encryption Key (Hex):", Buffer.from(ENCRYPTION_KEY, "hex").toString("hex"));
  console.log("Encrypted Data:", encrypted); // Log encrypted data
  console.log("IV (Hex):", iv.toString("hex")); // Log IV used during encryption
  return { encryptedData: encrypted, iv: iv.toString("hex") }; // Return encrypted data and IV as hex
};
// Decrypt a field
const decryptField = (encryptedField, iv) => {
  console.log("Encrypted Data (for decryption):", encryptedField); // Log encrypted data for decryption
  console.log("IV (Hex, for decryption):", iv); // Log IV for decryption
  try {
    // Convert iv to Buffer before passing to createDecipheriv
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, "hex"), Buffer.from(iv, "hex")); // Create decipher with the fixed key (Buffer)
    let decrypted = decipher.update(encryptedField, "hex", "utf8"); // Decrypt the field
    decrypted += decipher.final("utf8"); // Final decryption step
    console.log("Decrypted Data:", decrypted); // Log decrypted data
    return decrypted;
  } catch (err) {
    console.error("Decryption error:", err); // Log error if decryption fails
    throw new Error("Decryption failed: " + err.message); // Provide more detailed error message
  }
};
module.exports = { encryptField, decryptField };