import * as mongoose from 'mongoose';
import { schemaOptions } from '../utils/index';

export const PriceSchema = new mongoose.Schema(
  {
    mlc: { type: Number, default: 125 },
    mn: { type: Number, default: 100 },
    oneandhalfkgPrice: { type: Number, default: 21 },
    twokgPrice: { type: Number, default: 25 },
    threekgPrice: { type: Number, default: 30 },
    fourkgPrice: { type: Number, default: 37 },
    fivekgPrice: { type: Number, default: 46 },
    sixkgPrice: { type: Number, default: 52 },
    sevenkgPrice: { type: Number, default: 58 },
    eigthkgPrice: { type: Number, default: 61 },
    ninekgPrice: { type: Number, default: 70 },
    tenkgPrice: { type: Number, default: 80 },
  },
  { ...schemaOptions },
);
