import { IsString } from 'class-validator';
import { Document } from 'mongoose';

export class Description extends Document {
  @IsString()
  title: string;

  @IsString()
  content: string;
}
