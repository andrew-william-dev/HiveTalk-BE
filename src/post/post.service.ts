import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schema/post.schema';

@Injectable()
export class PostService {
    constructor(@InjectModel(Post.name) private postModel: Model<Post>) { }

    async createPost(postData: Partial<Post>): Promise<Post> {
        const newPost = new this.postModel(postData);
        return newPost.save();
    }

    async getPostsByUsername(username: string): Promise<Post[]> {
        return this.postModel.find({ username }).exec();
    }

    async getAllPosts(): Promise<Post[]> {
        return this.postModel.find().exec();
    }

    async upvotePost(postId: string, username: string): Promise<Post> {
        const post = await this.postModel.findById(postId);
        if (!post) throw new Error('Post not found');

        if (!post.upvotes.includes(username)) {
            post.upvotes.push(username);
            post.downvotes = post.downvotes.filter((u) => u !== username);
        } else {
            const idx = post.upvotes.indexOf(username);
            post.upvotes.splice(idx, 1);
            post.downvotes = post.downvotes.filter((u) => u !== username);
        }
        return post.save();
    }

    async downvotePost(postId: string, username: string): Promise<Post> {
        const post = await this.postModel.findById(postId);
        if (!post) throw new Error('Post not found');

        if (!post.downvotes.includes(username)) {
            post.downvotes.push(username);
            post.upvotes = post.upvotes.filter((u) => u !== username);
        } else {
            const idx = post.downvotes.indexOf(username);
            post.downvotes.splice(idx, 1);
            post.upvotes = post.upvotes.filter((u) => u !== username);
        }
        return post.save();
    }

    async getUpvotedPosts(username: string): Promise<Post[]> {
        return this.postModel.find({ upvotes: username }).exec();
    }
    
    async getDownvotedPosts(username: string): Promise<Post[]> {
        return this.postModel.find({ downvotes: username }).exec();
    }
}
