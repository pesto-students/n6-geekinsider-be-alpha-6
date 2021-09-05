import { IChat } from '@/interfaces/IChat';
import mongoose from 'mongoose';

const Chat = new mongoose.Schema(
  {
    _id: {
      type: String,   // This will the cognito user name itself which will be used as an id paramter
      required: true,
      unique: true
    },
    canid: {
      type: String,
      required: true,
    },
    comid: {
      type: String,
      required: true,
    },
    status:{
        type: Number,
    },
  },
);


export default mongoose.model<IChat & mongoose.Document>('Chat', Chat);