import { Types, Document } from 'mongoose';

export interface IPrivacyPolicy {
  title?: string;
  content: string;
  created_by?: Types.ObjectId | string;
  updated_by?: Types.ObjectId | string;
  created_at?: Date;
  updated_at?: Date;
}

// This interface represents the document saved in MongoDB
export interface IPrivacyPolicyDocument extends IPrivacyPolicy, Document {
  _id: Types.ObjectId;
}