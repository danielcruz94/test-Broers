import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import forFeatureDb from "../../../src/db";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [MongooseModule.forFeature(forFeatureDb)],
  exports: [UserService],
})
export class UserModule {}