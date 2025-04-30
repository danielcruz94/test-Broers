// user.entity.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { v4 as uuid } from "uuid";


export type UserDocument = User & Document;

@Schema({ _id: false })
class Recovery {
  @Prop()
  token: string;

  @Prop()
  expires: number;
}

const RecoverySchema =SchemaFactory.createForClass(Recovery)

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
  timestamps: true,
})

export class User {
  @Prop({
    type: String,
    unique: true,
    default: function genUUID() {
      return uuid();
    },
  })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: true  })
  isActive: boolean;

  @Prop({ type: RecoverySchema })
  recoveryPassword: Recovery | undefined;
}

export const UserSchema = SchemaFactory.createForClass(User);

