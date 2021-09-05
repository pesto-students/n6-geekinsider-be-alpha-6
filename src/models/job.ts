import { IJob } from '@/interfaces/IJob';
import mongoose from 'mongoose';

const Job = new mongoose.Schema(
  {
    _id: { 
        type: String,     // this will be used as email id attribute
        required: true,
    },
    exp:{
        type: Number,
    },
    ctc:{
        type: Number,
    },
    companyName:{
        type: String,
        required: true
    },
    companyId:{
        type: String,
        required: true
    },
    jobTitle: {
        type: String
    },
    jobLocation:{
        type: String
    },
    jobStatus: {
        type: Boolean,
        default: true
    },
    skills:[],
    jobAboutid: {
        type: String
    },
    jobslug:{
        type:String
    },
    canApplied:[],  // we will hav eto add a limiting condition to the skills so as to advoid data flow conjestion
  },
);

export default mongoose.model<IJob & mongoose.Document>('Job', Job);