// ============================================================
// uploadMiddleware.js
// Multer configuration for handling product image uploads.
//
// What this does:
//   - Accepts image files from multipart/form-data requests
//   - Saves images to the /uploads folder on the server
//   - Generates unique filenames using timestamps + original name
//   - Rejects files that are not jpg, jpeg, png, or webp
//   - Rejects files larger than 5 MB
// ============================================================

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ---------------------------------------------------------
// Step 1: Use memoryStorage to avoid saving files to disk.
//         Files will be stored in memory as Buffer objects.
// ---------------------------------------------------------
const storage = multer.memoryStorage();

// ---------------------------------------------------------
// Step 3: File filter — only allow image types.
//         Rejects anything that isn't jpg, jpeg, png, webp.
// ---------------------------------------------------------
const fileFilter = function (req, file, cb) {
    // Allowed MIME types for images
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (allowedTypes.includes(file.mimetype)) {
        // Accept the file
        cb(null, true);
    } else {
        // Reject the file with an error message
        cb(new Error("Only jpg, jpeg, png, and webp images are allowed."), false);
    }
};

// ---------------------------------------------------------
// Step 4: Create the multer upload instance.
//         - storage: where/how to save the file
//         - fileFilter: which file types to accept
//         - limits: max file size = 5 MB (5 * 1024 * 1024 bytes)
// ---------------------------------------------------------
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB in bytes
    }
});

module.exports = upload;
