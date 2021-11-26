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

import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { AuthController } from '../auth/auth.controller';
import { CardsService } from '../cards/cards.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { CoinsService } from '../coins/coins.service';

@Injectable()
@Controller('orders')
export class OrdersController {

  // @ts-ignore
  @Inject()
  // protected authService: AuthService;
  // protected usersService: UsersService;
  constructor(
    private readonly ordersService: OrdersService,
    private usersService: UsersService,
    private cardsService: CardsService,
    private authService: AuthService,
    private configService: ConfigService,
    private coinsService: CoinsService) {
  }

  @Post()
  @UseGuards(AuthGuard())
  async addProduct(
    // tslint:disable-next-line:variable-name
    @Body('card_id') card_id: number,
    @Body('type') type: string,
    @Body('currency') currency: string,
   // @Body('price') price: number,
    @Body('network') network: string,
    @Body('value') value: number,
    @Body('wallet') wallet: string,
    @Headers() headers: Headers,
  ) {

    // @ts-ignore
    const token = await headers.authorization.split(' ');
    const user = await this.authService.getUser(token[1]);
    const profile = await this.usersService.getProfile(user.email);
    const coin = await this.coinsService.getSingleProduct(currency);
    const subcoin = await this.coinsService.getSubCoinsOneCoinWithSign(network);

    // check min and max Buy
    if (type === 'Buy') {
      // tslint:disable-next-line:no-empty
      if (value >= coin.minBuy && value <= coin.maxBuy) {
      } else {
        return {
          status: 402,
          error: 'error minBuy & maxBuy',
        };
      }
    }
    // check min and max Sell
    if (type === 'Sell') {
      // tslint:disable-next-line:no-empty
     if (value >= coin.minSell && value <= coin.maxSell) {
      } else {
        return {
          status: 402,
          error: 'error minSell & maxSell',
        };
      }
    }

    // Check User kyc is done
    // @ts-ignore
    if (profile.status !== 'done') {
      return {
        status: 402,
        error: 'kyc is not done',
      };
    }

    const checkCard = await this.cardsService.getOneCard(card_id);
    // Check User card is valid and checked
    // @ts-ignore
    if (checkCard[0].status !== 1) {
      return {
        status: 402,
        error: 'card is not valid and status is not 1',
      };
    }

    if (type === 'Buy') {
      // @ts-ignore
      var priceOrder = await coin.sellPrice;
      // @ts-ignore
      var costOrder = await value - subcoin[0].fee;
    } else {
      // @ts-ignore
      var priceOrder = await coin.buyPrice;
      // @ts-ignore
      var costOrder = await value * coin.buyPrice;
    }

    // @ts-ignore
    if (checkCard[0].user_id === profile.id) {
      const generatedId = await this.ordersService.insertProduct(
        // @ts-ignore
        profile.id, card_id, type,
        // @ts-ignore
        currency, priceOrder, value, costOrder, wallet, network,
      );
      return { id: generatedId };
    } else {
      return { status: 401 };
    }
  }

  @Get()
  @UseGuards(AuthGuard())
  async getAllOrders(@Headers() headers: Headers) {

    // @ts-ignore
    const token = await headers.authorization.split(' ');
    const user = await this.authService.getUser(token[1]);
    const profile = await this.usersService.getProfile(user.email);
    // @ts-ignore
    const orders = await this.ordersService.getOrders(profile.id);
    return orders;
  }

  @Post('/one')
  @UseGuards(AuthGuard())
  async getProduct(@Body('id') id: number, @Headers() headers: Headers) {

    // @ts-ignore
    const order = await this.ordersService.getSingleProduct(id);

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

  @Post('/pay/token')
  @UseGuards(AuthGuard())
  // tslint:disable-next-line:variable-name
  async paySendToken(@Body('order_id') order_id: number, @Headers() headers: Headers) {
    // @ts-ignore
    const token = await headers.authorization.split(' ');
    const user = await this.authService.getUser(token[1]);
    const profile = await this.usersService.getProfile(user.email);

    // @ts-ignore
    const order = await this.ordersService.getSingleProduct(order_id);
    const card = await this.cardsService.getOneCard(order[0].card_id);

    // @ts-ignore
    if (order[0].user_id === profile.id
      && order[0].pay_status === false
      // @ts-ignore
      && card[0].user_id === profile.id
      && card[0].status === 1
    ) {

      return axios.post('https://ipg.vandar.io/api/v3/send', {
        api_key: this.configService.get<string>('VANDAR_API'),
        amount: order[0].cost, // @ts-ignore
        mobile_number: profile.phone,
        factorNumber: order[0].id,
        description: 'سفارش',
        valid_card_number: card[0].cardNumber,
        callback_url: this.configService.get<string>('VANDAR_CALLBACK'),
      })
        .then(async response => {
          // tslint:disable-next-line:no-console
          console.log(response);
          // @ts-ignore
          await this.ordersService.updateTokenPayOrder(order[0].id, response.token);
        })
        .catch(error => {
          // tslint:disable-next-line:no-console
          console.log(error.response.data);
          return error.response.data;
        });
    }

  }

  @Post('/pay/callback')
  @UseGuards(AuthGuard())
  // tslint:disable-next-line:variable-name
  async payCallback(@Body('order_id') order_id: number, @Headers() headers: Headers) {
    // @ts-ignore
    const token = await headers.authorization.split(' ');
    const user = await this.authService.getUser(token[1]);
    const profile = await this.usersService.getProfile(user.email);

    // @ts-ignore
    const order = await this.ordersService.getSingleProduct(order_id);
    const card = await this.cardsService.getOneCard(order[0].card_id);

    return axios.post('https://vandar.io/api/ipg/2step/transaction', {
      api_key: this.configService.get<string>('VANDAR_API'),
      token: order[0].pay_token, // @ts-ignore
    })
      .then(async response => {
        // @ts-ignore
        await this.ordersService.updateStatusPayOrder(order[0].id);
        // tslint:disable-next-line:no-console
        console.log(response);
      })
      .catch(error => {
        // tslint:disable-next-line:no-console
        console.log(error.response.data);
        return error.response.data;
      });

  }
}
