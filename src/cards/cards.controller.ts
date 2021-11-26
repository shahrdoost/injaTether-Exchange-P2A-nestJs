import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete, UseGuards, Headers, Inject, HttpException, HttpStatus,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { CardsService } from './cards.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { AuthController } from '../auth/auth.controller';

@Injectable()
@Controller('cards')
export class CardsController {

  // @ts-ignore
  @Inject()
  // protected authService: AuthService;
  // protected usersService: UsersService;
  constructor(private readonly cardsService: CardsService , private usersService: UsersService, private authService: AuthService) {
  }

  @Post()
  @UseGuards(AuthGuard())
  async addCart(
    @Body('bank') bank: string,
    @Body('cardNumber') cardNumber: string,
    @Body('ibanNumber') ibanNumber: string,
    @Body('accountNumber') accountNumber: string,
    @Headers() headers: Headers,
  ) {
    // @ts-ignore
    const token = await headers.authorization.split(' ');
    const user = await this.authService.getUser(token[1]);
    const profile = await this.usersService.getProfile(user.email);
    const generatedId = await this.cardsService.insertCard(
      bank,
      cardNumber,
      ibanNumber,
      // @ts-ignore
      accountNumber,
      // @ts-ignore
      profile.id,
    );
    return { id: generatedId };
  }

  @Get()
  @UseGuards(AuthGuard())
  async getAllProducts(@Headers() headers: Headers) {

    // @ts-ignore
    const token = await headers.authorization.split(' ');
    const user = await this.authService.getUser(token[1]);
    const profile = await this.usersService.getProfile(user.email);
    // @ts-ignore
    const cards = await this.cardsService.getAllCards(profile.id);
    return cards;
  }

  @Get('/valid')
  @UseGuards(AuthGuard())
  async getAllCardsValid(@Headers() headers: Headers) {

    // @ts-ignore
    const token = await headers.authorization.split(' ');
    const user = await this.authService.getUser(token[1]);
    const profile = await this.usersService.getProfile(user.email);
    // @ts-ignore
    const cards = await this.cardsService.getAllCardsValid(profile.id);
    if (cards.length === 0) {
      return {
        status: 304 ,
      };
    } else {
      return cards;
    }

  }

  @Post('/one')
  @UseGuards(AuthGuard())
  async getOneCard(@Body('id') id: string, @Headers() headers: Headers) {

    // @ts-ignore
    const order = await this.cardsService.getOneCard(id);

    // @ts-ignore
    const token = await headers.authorization.split(' ');
    const user = await this.authService.getUser(token[1]);
    const profile = await this.usersService.getProfile(user.email);
    // @ts-ignore
    if (order[0].user_id === profile.id) {
      return order;
    } else {
      throw new HttpException('NotFound', HttpStatus.FORBIDDEN);
    }

  }

}
