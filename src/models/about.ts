import { IAbout } from '@/interfaces/IAbout';
import mongoose from 'mongoose';

const About = new mongoose.Schema(
  {
    _id: {
      type: String,   // This will be the email id of the user as we are keeping it unique in our system
      required: true,
      unique: true
    },
    about: {
      type: String,
      required: true,
    }
  },
);


export default mongoose.model<IAbout & mongoose.Document>('User', About);