import {
  Controller,
  Post,
  Body,
  Get,
  Headers,
  UseGuards,
  Inject,
  HttpException,
  HttpStatus,
  Response, forwardRef,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UsersService } from '../users/users.service';
import { Injectable } from '@nestjs/common';
import { Response as Res } from 'express';

@Injectable()
@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService,
              @Inject(forwardRef(() => UsersService))
  private usersService: UsersService) {
  }

  @Post()
  async login(@Body() loginUserDto: LoginUserDto) {

    return await this.authService.validateUserByPassword(loginUserDto);

  }

  @Get('/profile')
  async profile(@Headers() headers: Headers) {
    // tslint:disable-next-line:max-line-length
    // @ts-ignore
    const token = await headers.authorization.split(' ');
    const user = await this.authService.getUser(token[1]);

    const profile = await this.usersService.getProfile(user.email);
    return profile;
  }

}
