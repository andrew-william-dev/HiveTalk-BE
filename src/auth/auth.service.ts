import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/userSchema';
import * as hasher from 'password-hash';
import { JwtService } from '@nestjs/jwt';

type tokentype = { access_token: string, refresh_token: string };

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,) { }

  private generateTokens(username: string, email: string) : tokentype {
    const payload = { username, email };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET || 'access-secret',
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      expiresIn: '1d',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async create(username: string, email: string, password: string): Promise<tokentype> {
    try {
      const hashPwd = hasher.generate(password)
      const newUser = new this.userModel({ username, email, password: hashPwd });
      await newUser.save();
      return this.generateTokens(newUser.username, newUser.email);
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Username or email already exists');
      }
      throw error;
    }
  }

  async login(username: string, password: string): Promise<tokentype> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) throw new Error('User not found');

    const isValid = await hasher.verify(password, user.password);
    if (!isValid) throw new Error('Invalid credentials');

    return this.generateTokens(user.username, user.email);
  }

}
