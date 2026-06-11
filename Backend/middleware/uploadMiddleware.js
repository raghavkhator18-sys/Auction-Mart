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
// Step 1: Make sure the "uploads" folder exists.
//         If it doesn't exist yet, create it automatically.
// ---------------------------------------------------------
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// ---------------------------------------------------------
// Step 2: Define where and how uploaded files are saved.
//         We use "diskStorage" to save files to disk.
// ---------------------------------------------------------
const storage = multer.diskStorage({
    // destination: the folder where uploaded images are stored
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },

    // filename: generate a unique name for each uploaded file
    // Format: <timestamp>-<original-filename>
    // Example: 1718392039-vintage-watch.jpg
    filename: function (req, file, cb) {
        // Get the original file extension (e.g., ".jpg")
        const ext = path.extname(file.originalname).toLowerCase();

        // Get the original name without extension and replace spaces with hyphens
        const baseName = path.basename(file.originalname, ext)
            .toLowerCase()
            .replace(/\s+/g, "-")       // spaces → hyphens
            .replace(/[^a-z0-9\-]/g, ""); // remove special characters

        // Final filename: timestamp + cleaned name + extension
        const uniqueName = `${Date.now()}-${baseName}${ext}`;
        cb(null, uniqueName);
    }
});

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
