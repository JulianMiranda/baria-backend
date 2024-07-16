import * as mongoose from 'mongoose';
import { schemaOptions } from '../utils/index';

const SubcategorySchema = new mongoose.Schema(
  {
    name: { type: String, index: true },
    description: [],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: 'Category',
    },
    value: Number,
    textSearch: { type: String, index: true },
    price: Number,
    info: [{ type: String }],
    priceGalore: Number,
    priceDiscount: { type: Number, default: 0 },
    priceGaloreDiscount: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
    status: { type: Boolean, default: true, index: true },
    soldOut: { type: Boolean, default: false, index: true },
  },
  { ...schemaOptions },
);
SubcategorySchema.index({ name: 'text' });
SubcategorySchema.index({ textSearch: 'text' });

export default SubcategorySchema;
