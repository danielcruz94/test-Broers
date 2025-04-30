import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from  './entities/user.entity';
import { InjectModel } from  '@nestjs/mongoose';
import { Model } from  'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()



export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}
 

  async create(createUserDto: CreateUserDto): Promise<User> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return newUser.save();
  }

  findByEmail(email: string) {
    return this.userModel.findOne({email})
  }

  findById(id: string) {
    return this.userModel.findById(id)
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  async findByResetToken(token:string){
    const user= await this.userModel.findOne({ 'recoveryPassword.token': token });
    return user
  }

  

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne({ _id: id }, updateUserDto)
  }


  findAll() {
    return this.userModel.find({})
  }

  async remove(id: string): Promise<any> {
    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) {
      throw new Error('Usuario no encontrado');
    }
    return { message: 'Usuario eliminado correctamente' };
  }

  

}
