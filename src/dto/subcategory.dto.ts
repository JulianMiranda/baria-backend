import { IsString, IsNumber, IsArray } from 'class-validator';
import { Document } from 'mongoose';
import { Image } from './image.dto';
import { Description } from './description.dto';

export class Subcategory extends Document {
  @IsString()
  name: string;

  @IsArray()
  images: Array<Partial<Image>>;

  @IsArray()
  description: Array<Description>;

  @IsArray()
  deleteImages: string[];
  @IsString()
  category: string;

  @IsNumber()
  weight: number;

  @IsNumber()
  value: number;

  @IsArray()
  info: string[];

  @IsNumber()
  price: number;

  @IsNumber()
  priceGalore: number;

  @IsNumber()
  priceDiscount: number;

  @IsNumber()
  priceGaloreDiscount: number;

  @IsString()
  currency: string;
}
