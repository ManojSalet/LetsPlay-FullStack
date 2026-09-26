const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// POST /api/upload - Upload single image (Admin only)
router.post('/', protect, adminOnly, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('File upload error:', err.message);
      return res.status(400).json({ message: err.message || 'File upload failed' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // Relative path for client storage and retrieval
    const relativeUrl = `/uploads/${req.file.filename}`;

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      url: relativeUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  });
});

module.exports = router;
