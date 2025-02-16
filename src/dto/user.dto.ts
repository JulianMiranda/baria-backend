import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsMongoId,
  IsPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';
import { Document } from 'mongoose';

export class User extends Document {
  @IsString()
  firebaseId: string;

  @IsBoolean()
  online: boolean;

  @IsBoolean()
  status: boolean;

  @IsBoolean()
  reciveNotifications: boolean;

  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsString()
  serviceZone: string;

  @IsString()
  @IsPhoneNumber()
  phone: string;

  @IsString()
  role: string;

  @IsArray()
  permissions: string[];

  @IsArray()
  codes: string[];

  @IsString()
  defaultImage: string;

  @IsString()
  newFavorite: string;

  @IsString()
  removeFavorite: string;

  @IsString()
  notificationTokens: string;

  @IsString()
  theme: string;
}
