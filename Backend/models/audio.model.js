import mongoose from 'mongoose';

const audioSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true }, // /uploads/images/xxx.jpg
    audioUrl: { type: String, required: true }, // /uploads/audio/xxx.mp3
    durationSec: { type: Number, min: 30, required: true }, // enforce min 30s
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Audio', audioSchema);
