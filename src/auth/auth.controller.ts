import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() body: { username : string, email : string, password : string }) {
    return this.authService.create(body.username, body.email, body.password)
  }
  
  @Post('login')
  login(@Body() body: { username : string, password : string }) {
    return this.authService.login(body.username, body.password)
  }
}
