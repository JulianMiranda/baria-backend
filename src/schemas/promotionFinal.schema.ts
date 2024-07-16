import * as mongoose from 'mongoose';
import { schemaOptions } from '../utils/index';

export const PromotionFinalSchema = new mongoose.Schema(
  {
    owner: { type: String },
    status: { type: Boolean, default: true, index: true },
    image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },
  },
  { ...schemaOptions },
);
