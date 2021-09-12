import { IGit } from '@/interfaces/IGit';
import mongoose from 'mongoose';

const Git = new mongoose.Schema(
  {
    _id: { 
      type: String,     // this will be used as email id attribute
      required: true,
    },
    repoCount:{ 
        type: Number,   // this will be used as email id attribute
        required: true, // https://api.github.com/users/vishaljkk
    },
    repoName:[],        // https://api.github.com/repos/git-username/repos
    skills: [],         // https://api.github.com/repos/git-username/repos
    skillsOrder: [],
  },
);


export default mongoose.model<IGit & mongoose.Document>('Git', Git);