import {Controller, Post, Get, Body, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { profile } from 'node:console';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(
      body.name,
      body.email,
      body.password,
    );
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(
      body.email,
      body.password,
    );
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile() {
    return {
      message: 'You are authenticated 🎉',
    };
  }
}
