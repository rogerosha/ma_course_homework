require('dotenv').config();

const config = {
  port: Number(process.env.PORT) || 3000,
  uploadDir: process.env.UPLOAD_DIR || process.exit(1),
  optimizedDir: process.env.OPTIMIZED_DIR || process.exit(1),
};

module.exports = {
  config,
};
