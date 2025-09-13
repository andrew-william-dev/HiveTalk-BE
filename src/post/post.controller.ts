import {
  Controller,
  Post as HttpPost,
  Body,
  Get,
  Query,
  Put,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PostService } from './post.service';
import { Post as PostModel } from './schema/post.schema';
import { extname } from 'path';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @HttpPost('upload')
  @UseInterceptors(
    FileInterceptor('coverImage', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createPostWithImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: Partial<PostModel>,
  ) {
    return this.postService.createPost({
      ...body,
      coverImage: file ? `/uploads/${file.filename}` : null,
    });
  }

  @Get('user')
  async getPostsByUser(@Query('username') username: string) {
    return this.postService.getPostsByUsername(username);
  }

  @Get()
  async getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Put('upvote')
  async upvotePost(@Query('id') postId: string, @Query('username') username: string) {
    return this.postService.upvotePost(postId, username);
  }

  @Put('downvote')
  async downvotePost(@Query('id') postId: string, @Query('username') username: string) {
    return this.postService.downvotePost(postId, username);
  }

  @Get('upvoted')
  async getUpvotedPosts(@Query('username') username: string) {
    if (!username) throw new Error('Username is required');
    return this.postService.getUpvotedPosts(username);
  }

  @Get('downvoted')
  async getDownvotedPosts(@Query('username') username: string) {
    if (!username) throw new Error('Username is required');
    return this.postService.getDownvotedPosts(username);
  }
  
}

