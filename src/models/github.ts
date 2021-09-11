import { IConnect } from '@/interfaces/IConnect';
import mongoose from 'mongoose';

const Connect = new mongoose.Schema(
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
    skills: [],         // https://api.github.com/repos/git-username/repo-name/languages
  },
);


export default mongoose.model<IConnect & mongoose.Document>('Connect', Connect);