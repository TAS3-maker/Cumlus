const crypto = require("crypto");
// Ensure your ENCRYPTION_KEY is exactly 32 characters (AES-256).
const ENCRYPTION_KEY = "3eacbc92236d173210b616971597ebd3"; 
if (ENCRYPTION_KEY.length !== 32) {
  throw new Error("Encryption key must be exactly 32 characters long.");
}
const IV_LENGTH = 16; // AES block size
// Encrypt function
function encryptvoice(plainText) {
  const iv = crypto.randomBytes(IV_LENGTH); // Generate a random initialization vector
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted,
  };
}
// Decrypt function
function decryptvoice(encryptedData, iv) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
module.exports = {
  encryptvoice,
  decryptvoice,
};