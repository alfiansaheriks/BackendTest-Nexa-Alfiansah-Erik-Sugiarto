const crypto = require("crypto");
require("dotenv").config();

// generate 16 buytes
function getKey() {
  const key = Buffer.alloc(16);
  Buffer.from(process.env.AES_KEY).copy(key); 
  return key;
}

// init vector for aes
const iv = Buffer.alloc(16, 0); 

function encrypt(text) {
  const key = getKey();

  const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted;
}

function decrypt(inputPassword, encryptedBuffer) {
  const key = getKey();

  const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
  let decrypted = decipher.update(Buffer.from(encryptedBuffer));
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString("utf8") === inputPassword;
}

module.exports = {
  encrypt,
  decrypt,
};
