import multer from 'multer';
import path from 'path';
import fs from 'fs';

const IMG_DIR = 'uploads/images';
const AUD_DIR = 'uploads/audio';

// Create directories if they don't exist (without throwing errors if they already exist)
[IMG_DIR, AUD_DIR].forEach((dir) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  } catch (error) {
    console.error(`Error creating directory ${dir}:`, error.message);
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (file.fieldname === 'image') {
        // Ensure directory exists before saving
        if (!fs.existsSync(IMG_DIR)) {
          fs.mkdirSync(IMG_DIR, { recursive: true });
        }
        cb(null, IMG_DIR);
      } else {
        // Ensure directory exists before saving
        if (!fs.existsSync(AUD_DIR)) {
          fs.mkdirSync(AUD_DIR, { recursive: true });
        }
        cb(null, AUD_DIR);
      }
    } catch (error) {
      cb(error);
    }
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '-').toLowerCase();
    cb(null, `${base}-${Date.now()}${ext}`);
  }
});

function fileFilter(_req, file, cb) {
  const isImage = file.fieldname === 'image';
  if (isImage && !/image\/(png|jpeg|jpg|webp)/.test(file.mimetype)) return cb(new Error('Invalid image type'));
  if (!isImage && !/(audio|mpeg|mp3|wav|ogg)/.test(file.mimetype)) return cb(new Error('Invalid audio type'));
  cb(null, true);
}

export const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB
