import { IConnect } from '@/interfaces/IConnect';
import mongoose from 'mongoose';

const Connect = new mongoose.Schema(
  {
    _id: { 
      type: String,     // this will be used as email id attribute
      required: true,
    },
    canid: {
      type: String,
    },
    conid: {
      type: String,
    },
    status: {
      type: Number,
    }
  },
);


export default mongoose.model<IConnect & mongoose.Document>('Connect', Connect);