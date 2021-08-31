import { IUser } from '@/interfaces/IUser';
import mongoose from 'mongoose';

const User = new mongoose.Schema(
  {
    // _id: {
    //   type: String,   // This will the cognito user name itself which will be used as an id paramter
    //   required: true,
    //   unique: true
    // },
    email: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: String,
      default: "userCandidate",
      enum: ["userRecruiter", "userCandidate"]
    }
  },
);


export default mongoose.model<IUser & mongoose.Document>('User', User);