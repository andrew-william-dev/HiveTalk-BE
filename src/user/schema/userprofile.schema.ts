import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UserProfile extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  bio?: string;

  @Prop({ type: [String], default: [] })
  interests?: string[];

  @Prop()
  dob?: string; // ISO date string

  @Prop()
  location?: string;

  @Prop()
  occupation?: string;

  @Prop()
  website?: string;

  @Prop()
  weblink?: string;

  @Prop()
  profilePicUrl?: string;

  @Prop()
  bannerPicUrl?: string;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
