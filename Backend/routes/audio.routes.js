import { Router } from 'express';
import auth from '../middlewear/auth.middlewear.js';
import { upload } from '../utils/fileupload.js';
import { createAudio, listAudio, getAudio, updateAudio, deleteAudio } from '../controllers/audio.controller.js';

const router = Router();

// multipart: image + song
const uploader = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'song', maxCount: 1 }
]);

router.get('/', auth, listAudio);
router.get('/:id', auth, getAudio);
router.post('/', auth, uploader, createAudio);
router.put('/:id', auth, uploader, updateAudio);
router.delete('/:id', auth, deleteAudio);

export default router;
