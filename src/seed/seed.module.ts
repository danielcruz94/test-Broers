import { Module } from '@nestjs/common';
import { UserModule } from '../module/user/user.module'
import { SeedService } from './seed/seed.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MongooseModule.forRootAsync({
    useFactory: (configService: ConfigService) => ({
      uri: configService.get<string>('MONGO_CONNECTION_STRING'),
    }),
    inject: [ConfigService],
  }), UserModule],
  providers: [SeedService],
})
export class SeedModule {}