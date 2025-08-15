import Audio from '../models/audio.model.js';
import path from 'path';

export async function createAudio(req, res) {
  try {
    const { name, desc, durationSec } = req.body;
    if (!name || !desc) return res.status(400).json({ message: 'name & desc required' });

    // duration check (client also validates using <audio> metadata)
    const dur = Number(durationSec || 0);
    if (!dur || dur < 30) return res.status(400).json({ message: 'Audio must be >= 30 seconds' });

    const imageUrl = req.files?.image?.[0] ? `/uploads/images/${path.basename(req.files.image[0].path)}` : null;
    const audioUrl = req.files?.song?.[0] ? `/uploads/audio/${path.basename(req.files.song[0].path)}` : null;
    if (!imageUrl || !audioUrl) return res.status(400).json({ message: 'image and audio required' });

    const doc = await Audio.create({
      name,
      desc,
      imageUrl,
      audioUrl,
      durationSec: dur,
      createdBy: req.user.id
    });
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function listAudio(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
    const q = {};
    const total = await Audio.countDocuments(q);
    const items = await Audio.find(q).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function getAudio(req, res) {
  try {
    const item = await Audio.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function updateAudio(req, res) {
  try {
    const { name, desc, durationSec } = req.body;
    const update = {};
    if (name) update.name = name;
    if (desc) update.desc = desc;
    if (durationSec) update.durationSec = Number(durationSec);

    if (req.files?.image?.[0]) update.imageUrl = `/uploads/images/${path.basename(req.files.image[0].path)}`;
    if (req.files?.song?.[0]) update.audioUrl = `/uploads/audio/${path.basename(req.files.song[0].path)}`;

    const doc = await Audio.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function deleteAudio(req, res) {
  try {
    const ok = await Audio.findByIdAndDelete(req.params.id);
    if (!ok) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
