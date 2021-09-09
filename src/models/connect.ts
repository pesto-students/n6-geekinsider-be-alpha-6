import { IConnect } from '@/interfaces/IConnect';
import mongoose from 'mongoose';

const Connect = new mongoose.Schema(
  {
    _id: { 
      type: String,     // this will be used as email id attribute
      required: true,
    },
    candidateid: {
      type: String,
    },
    companyid: {
      type: String,
    },
    status: {
      type: Number,
    },
    jobslug: {
      type: String,
    }
  },
);


export default mongoose.model<IConnect & mongoose.Document>('Connect', Connect);