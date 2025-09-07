// server/auth.js
const bcrypt = require('bcrypt');
const COST = 12;

async function hashPassword(plain) {
  return await bcrypt.hash(plain, COST); // embeds a random salt
}

async function verifyPassword(plain, digest) {
  return await bcrypt.compare(plain, digest);
}

module.exports = { hashPassword, verifyPassword };
