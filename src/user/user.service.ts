import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserProfile } from './schema/userprofile.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserProfile.name)
    private readonly userModel: Model<UserProfile>,
  ) {}

  async updateProfile(
    data: any,
    profileFile?: Express.Multer.File,
    bannerFile?: Express.Multer.File,
  ): Promise<UserProfile> {
    const { oldname, username, email, bio, interests, dob, location, occupation, website, weblink } = data;

    const user = await this.userModel.findOne({ username: oldname });
    if (!user) throw new NotFoundException('User not found');

    user.username = username || user.username;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.interests = interests ? interests.split(',').map((i: string) => i.trim()) : user.interests;
    user.dob = dob || user.dob;
    user.location = location || user.location;
    user.occupation = occupation || user.occupation;
    user.website = website || user.website;
    user.weblink = weblink || user.weblink;
    if (profileFile) user.profilePicUrl = `/uploads/${profileFile.filename}`;
    if (bannerFile) user.bannerPicUrl = `/uploads/${bannerFile.filename}`;

    return user.save();
  }

  async getUserByUsername(username: string) {
    return this.userModel.findOne({ username });
  }
}
