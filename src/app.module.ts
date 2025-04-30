import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from './module/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { SeedModule } from './seed/seed.module';

@Module({
 
  imports: [ ConfigModule.forRoot({ isGlobal: true }), MongooseModule.forRootAsync({
    useFactory: (configService: ConfigService) => ({
      uri: configService.get<string>('MONGO_CONNECTION_STRING'),
    }),
    inject: [ConfigService],
  }), UserModule, AuthModule, MailModule, SeedModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}