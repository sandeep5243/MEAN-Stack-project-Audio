import multer from 'multer';
import path from 'path';
import fs from 'fs';

const IMG_DIR = 'uploads/images';
const AUD_DIR = 'uploads/audio';

// Create directories if they don't exist (without throwing errors if they already exist)
[IMG_DIR, AUD_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image') cb(null, IMG_DIR);
    else cb(null, AUD_DIR);
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
