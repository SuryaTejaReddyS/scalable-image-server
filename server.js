const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: Date.now() + "-" + req.file.originalname,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    };

    const result = await s3.upload(params).promise();
    res.json({ url: result.Location });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});