import { Document, Model } from 'mongoose';
import { IUser } from '@/interfaces/IUser';
import { ICandidate } from '@/interfaces/ICandidate';
declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
    }    
  }

  namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type CandidateModel = Model<ICandidate & Document>;
  }
}
