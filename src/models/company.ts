import { ICompany } from '@/interfaces/ICompany';
import mongoose from 'mongoose';

const Company = new mongoose.Schema(
  {
    _id: { 
        type: String,     // this will be used as email id attribute
        required: true,
        unique : true
    },
    name:{
        type: String,
        required: true
    },
    whatsappNumber: {
        type: String
    },
    location:{
        type: String
    },
    preferredIndustry: {
        type: String,
    },
    skills:[],  // we will hav eto add a limiting condition to the skills so as to advoid data flow conjestion
    aboutid: {
        type: String
    },
    empSize:{
        type: Number
    },
    site:{
        type: String 
    },
    jobCount:{
        type: Number,
        default: 0
    },
    jobs:[],
  },
);


export default mongoose.model<ICompany & mongoose.Document>('Company', Company);