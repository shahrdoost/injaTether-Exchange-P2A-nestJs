import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  // @ts-ignore
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {

    const createdUser = new this.userModel(createUserDto);
    // @ts-ignore
    return await createdUser.save();

  }

  // @ts-ignore
  async findOneByEmail(email): Model<User> {

    // @ts-ignore
    return await this.userModel.findOne({email});

  }

  async getProfile(email: string) {
    return await this.userModel.findOne({email});
  }

  // tslint:disable-next-line:variable-name
  async updateTokenEmail(token: string, user_id: number) {
    await this.userModel.findOneAndUpdate( {id: user_id}, { token_email: token });
  }

  // tslint:disable-next-line:variable-name
  async updateTokenSms(token: string, user_id: number) {
    await this.userModel.findOneAndUpdate( {id: user_id}, { token_sms: token });
  }

  // tslint:disable-next-line:variable-name
  async updateStatusEmail(user_id: number) {
    await this.userModel.findOneAndUpdate( {id: user_id}, { email_status: 2 });
  }

  // tslint:disable-next-line:variable-name
  async updateStatusSms(user_id: number) {
    await this.userModel.findOneAndUpdate( {id: user_id}, { phone_status: 2 });
  }

  // tslint:disable-next-line:variable-name
  async updateSetNationalId_Image(user_id: number, file) {
    await this.userModel.findOneAndUpdate( {id: user_id}, { nationalId_image: file.filename, nationalId_image_status: 1 });
  }

  // tslint:disable-next-line:variable-name
  async updateSetselfi_Image(user_id: number, file) {
    await this.userModel.findOneAndUpdate( {id: user_id}, { selfi_image: file.filename, selfi_image_status: 1 });
  }

  // tslint:disable-next-line:variable-name
  async updateFinalCheck(user_id: number, name, lastName, homeNumber, BirthDate, nationalId, city, address) {
    await this.userModel.findOneAndUpdate( {id: user_id},
      { name, last_name: lastName,
      homeNumber, birthDate: BirthDate, nationalId, city, address, status: 'pending' });
  }
}
