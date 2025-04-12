import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  googleId: string;
  email: string;
  username: string;
  image?: string;
  isAcceptingMessages: boolean;
}

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    isAcceptingMessages: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
