import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../module/user/user.service';
import * as crypto from 'crypto';
import {MailService} from '../mail/mail.service'


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findByEmail(email);
    if (user&&user.isActive && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    throw new UnauthorizedException();
  }


  async request(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new Error('User not found');
    const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

     const created= await this.userService.update(user.id, {
        recoveryPassword:{
          token: hashedToken,
          expires: Date.now() + 1000 * 60 * 10,
        }  
      });
    
      
      await this.mailService.sendResetPasswordEmail(email, hashedToken);

   
      return {message:'Link de recuperación enviado al correo registrado'}
  }

  // auth.service.ts
async resetPassword(token: string, newPassword: string) {

  const user = await this.userService.findByResetToken(token);
  if(!user){
 throw new Error('Token expired or invalid');
  }
  if  (user.recoveryPassword && user.recoveryPassword?.expires < Date.now()){
    throw new Error('Token expired or invalid');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const a = await this.userService.update(user.id, {
    password: hashedPassword,
    recoveryPassword : null
  });

  return { message: 'Password has been reset successfully' };
}





  async login(user: any) {
    const payload = { username: user.name,email:user.email, sub: user._id };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

  

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = this.jwtService.sign(
        { username: user.name, sub: user._id },
        { expiresIn: '15m' },
      );

      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException('Refresh token expired or invalid');
    }
  }
}
