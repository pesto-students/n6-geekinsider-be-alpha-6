import { IAbout } from '@/interfaces/IAbout';
import mongoose from 'mongoose';

const About = new mongoose.Schema(
  {
    _id: { 
      type: String,     // this will be used as email id attribute
      required: true,
    },
    about: {
      type: String,
      required: true,
    }
  },
);


export default mongoose.model<IAbout & mongoose.Document>('About', About);