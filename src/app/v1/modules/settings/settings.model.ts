import { Schema, model, Types, Document } from 'mongoose';

// 1. Define an interface representing the document
export interface IPrivacyPolicy extends Document {
  // id: string;
  title?: string;
  content: string;
  created_by?: Types.ObjectId | null;
  updated_by?: Types.ObjectId | null;
  created_at: Date;
  updated_at: Date;
}

// 2. Pass the interface to the Schema
const PrivacyPolicySchema = new Schema<IPrivacyPolicy>(
  {
    // id: {
    //   type: String,
    //   trim: true,
    //   unique: true,
    //   default: () => new Types.ObjectId().toString(),
    // },
    title: {
      type: String,
      trim: true,
      maxlength: 255,
    },
    content: {
      type: String,
      required: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      currentTime: () => new Date(),
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 3. Explicitly type 'this' in the virtual getter
PrivacyPolicySchema.virtual('id').get(function (this: IPrivacyPolicy) {
  return this._id.toHexString();
});

const PrivacyPolicy = model<IPrivacyPolicy>(
  'PrivacyPolicy',
  PrivacyPolicySchema
);

export default PrivacyPolicy;
