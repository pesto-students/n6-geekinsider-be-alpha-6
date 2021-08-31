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
    preferredIndustry: {
        type: String,
    },
    skills:[],  // we will hav eto add a limiting condition to the skills so as to advoid data flow conjestion
    aboutid: {
        type: String
    },
  },
);


export default mongoose.model<ICompany & mongoose.Document>('Company', Company);