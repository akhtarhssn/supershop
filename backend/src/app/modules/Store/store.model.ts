import { Schema, model } from 'mongoose';
import { IStore } from './store.interface';

const storeSchema = new Schema<IStore>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    logo: {
      type: String,
    },
    banner: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
    },
    supportEmail: {
      type: String,
      unique: true,
    },
    supportPhone: {
      type: String,
      unique: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One seller, one store
    },
    location: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    followers: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Blocked'],
      default: 'Active',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

storeSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

storeSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Store = model<IStore>('Store', storeSchema);
