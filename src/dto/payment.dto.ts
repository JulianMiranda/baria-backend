import { IsString } from 'class-validator';
import { Document } from 'mongoose';

export class Payment extends Document {
  @IsString()
  name: string;
}
