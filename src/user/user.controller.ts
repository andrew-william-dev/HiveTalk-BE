import {
  Controller,
  Put,
  Body,
  UploadedFiles,
  UseInterceptors,
  Get,
  Query,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Put('update')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profilePic', maxCount: 1 },
        { name: 'bannerPic', maxCount: 1 },
      ], {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async updateProfile(
    @Body() body: any,
    @UploadedFiles() files: { profilePic?: Express.Multer.File[]; bannerPic?: Express.Multer.File[] },
  ) {
    const profileFile = files.profilePic?.[0];
    const bannerFile = files.bannerPic?.[0];

    return this.userService.updateProfile(body, profileFile, bannerFile);
  }

  @Get()
  async getUser(@Query('username') username: string) {
    return this.userService.getUserByUsername(username);
  }
}
