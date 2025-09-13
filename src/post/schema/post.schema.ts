import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Post extends Document {
    @Prop({ required: true })
    username: string; // user who created the post

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ type: [String], default: [] })
    upvotes: string[]; // usernames who upvoted

    @Prop({ type: [String], default: [] })
    downvotes: string[]; // usernames who downvoted

    @Prop({ type: String, default: null })
    coverImage: string | null; // file path or URL

    @Prop({ required: true })
    author: string; // display name or user reference
}

export const PostSchema = SchemaFactory.createForClass(Post);
