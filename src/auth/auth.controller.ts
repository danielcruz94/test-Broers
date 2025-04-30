import { Controller, Post, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }
  @Post('request')
  async resquest(@Body() body: { email: string}) {
    return this.authService.request(body.email);


  }

  @Post('reset-password')
  async resetPassword( @Query('token') token: string,
  @Body() body: { password: string }) {
   
    return this.authService.resetPassword(token, body.password);
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }
}