import { IsNumber } from 'class-validator';
import { Document } from 'mongoose';

export class Price extends Document {
  @IsNumber()
  mlc: number;

  @IsNumber()
  mn: number;

  @IsNumber()
  oneandhalfkgPrice: number;

  @IsNumber()
  twokgPrice: number;

  @IsNumber()
  threekgPrice: number;

  @IsNumber()
  fourkgPrice: number;

  @IsNumber()
  fivekgPrice: number;

  @IsNumber()
  sixkgPrice: number;

  @IsNumber()
  sevenkgPrice: number;

  @IsNumber()
  eigthkgPrice: number;

  @IsNumber()
  ninekgPrice: number;

  @IsNumber()
  tenkgPrice: number;
}
