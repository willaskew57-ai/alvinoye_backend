import { Schema, model, Types } from 'mongoose';
import bcrypt from 'bcrypt';

// ** import local files
import {
  USER_ROLE,
  USER_STATUS,
  type IUserModel,
  type TUser,
} from './user.interface';
import configs from '../../../../config';

const UserSchema = new Schema<TUser, IUserModel>(
  {
    full_name: {
      type: String,
      trim: true,
      required: [true, 'Full name is required'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, 'Email is required'],
    },
    role: {
      type: String,
      enum: {
        values: Object.values(USER_ROLE),
        message: `{VALUE} is not a valid role`,
      },
      required: [true, 'Role is required'],
    },
    status: {
      type: String,
      enum: {
        values: Object.values(USER_STATUS),
        message: `{VALUE} is not a valid status`,
      },
      default: USER_STATUS.PENDING,
      required: [true, 'Status is required'],
    },
    phone_number: {
      type: String,
      trim: true,
    },
    profile_picture: {
      type: String,
      trim: true,
      default: '',
    },
    is_profile_completed: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      trim: true,
      select: false,
      required: [true, 'Password is required'],
    },
    password_changed_at: {
      type: Date,
    },

    // Moderation & Deletion
    blocked_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    removed_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    deleted_date: {
      type: Date,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// --- Virtual Populates ---

// Link to DriverInfo
UserSchema.virtual('driver_info', {
  ref: 'DriverInfo', // Matches the model name in Driver model
  localField: '_id',
  foreignField: 'user_id',
  justOne: true,
});

// Link to Vehicle
UserSchema.virtual('vehicle', {
  ref: 'Vehicle', // Matches the model name in Vehicle model
  localField: '_id',
  foreignField: 'user_id',
  justOne: true,
});

// Static Methods
UserSchema.statics.isUserExistsById = async function (id: string) {
  return await this.findById(id).select('+password');
};

UserSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await this.findOne({ email }).select('+password');
};

UserSchema.statics.isUserActive = async function (user: TUser) {
  return user?.status === 'ACTIVE' || false;
};
UserSchema.statics.isUserDeleted = async function (user: TUser) {
  return user?.status === 'REMOVED' || false;
};
UserSchema.statics.isUserBlocked = async function (user: TUser) {
  return user?.status === 'BLOCKED' || false;
};
UserSchema.statics.isUserDeleted = async function (user: TUser) {
  return user?.status === 'DELETED' || false;
};

UserSchema.statics.isJWTIssuedBeforePasswordChanged = (
  passwordChangedTimeStamps: Date | undefined,
  jwtIssuedTimeStamps: number
) => {
  if (!passwordChangedTimeStamps) return false;
  const passwordChangeTime = passwordChangedTimeStamps.getTime() / 1000;
  return passwordChangeTime > jwtIssuedTimeStamps;
};

UserSchema.statics.compareUserPassword = async function (
  plainTextPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// Password hashing middleware
UserSchema.pre('save', async function () {
  if (this.isModified('password') && this.password) {
    try {
      this.password = await bcrypt.hash(
        this.password,
        Number(configs.bcrypt_salt_rounds)
      );

      this.password_changed_at = new Date();
    } catch (error) {
      throw error;
    }
  }
});

// Clear password after save
UserSchema.post('save', function (doc: any) {
  doc.password = undefined;
  doc.__v = undefined;
});

export const User = model<TUser, IUserModel>('User', UserSchema);
export default User;
