import { IAbout } from '@/interfaces/IAbout';
import mongoose from 'mongoose';

const About = new mongoose.Schema(
  {
    about: {
      type: String,
      required: true,
    }
  },
);


export default mongoose.model<IAbout & mongoose.Document>('About', About);