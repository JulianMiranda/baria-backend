import * as mongoose from 'mongoose';
import { schemaOptions } from '../utils/index';

const PaymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    token: String,
    amount: Number,
    currency: String,
    status: { type: Boolean, default: true, index: true },
  },
  { ...schemaOptions },
);

export default PaymentSchema;
