import { Injectable } from '@nestjs/common';
import { UserService } from '../../module/user/user.service'; 
import * as users from '../../../script/users.json'

@Injectable()
export class SeedService {
  constructor(private readonly userService: UserService) {}

  async run() {
    await this.seedUsers();
    // You can add more seeding methods here for other entities
  }

  private async seedUsers() {
  
   

   
    for (const user of users) {
      await this.userService.create(user);
    }

    console.log('Users have been seeded');
  }
}
