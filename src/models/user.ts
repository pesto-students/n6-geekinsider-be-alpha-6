import { IUser } from '@/interfaces/IUser';
import mongoose from 'mongoose';

const User = new mongoose.Schema(
  {
    _id: {
      type: String,                             // This will the cognito user name itself which will be used as an id paramter
      required: true,
      unique: true
    },
    email: {                                    // here we fill the email id for the user
      type: String,
      required: true,
      unique: true
    },
    role: {                                     // there can be two property for a user role either candidate or recruiter
      type: String,
      default: "userCandidate",
      enum: ["userRecruiter", "userCandidate"]
    }
  },
);


export default mongoose.model<IUser & mongoose.Document>('User', User);