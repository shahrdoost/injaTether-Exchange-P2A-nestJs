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

import { CoinsService } from './coins.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { AuthController } from '../auth/auth.controller';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { TelegramService } from 'nestjs-telegram';

@Injectable()
@Controller('coins')
export class CoinsController {

  // @ts-ignore
  @Inject()
  // protected authService: AuthService;
  // protected usersService: UsersService;
  constructor(
    private readonly coinsService: CoinsService,
    private usersService: UsersService,
    private authService: AuthService,
    private configService: ConfigService,
    // @ts-ignore
    private readonly telegram: TelegramService) {
  }

  @Post()
  async addProduct(
    @Body('type') type: string,
    @Body('name') name: string,
    @Body('persianName') persianName: string,
    @Body('sign') sign: string,
    @Body('wallet') wallet: string,
    @Body('walletTwo') walletTwo: string,
    @Body('buyPrice') buyPrice: number,
    @Body('sellPrice') sellPrice: number,
    @Body('minBuy') minBuy: number,
    @Body('maxBuy') maxBuy: number,
    @Body('maxSell') maxSell: number,
    @Body('minSell') minSell: number,
    @Body('active') active: number,
    @Headers() headers: Headers,
  ) {

    // @ts-ignore
    const token = await headers.authorization.split(' ');
    const user = await this.authService.getUser(token[1]);
    const profile = await this.usersService.getProfile(user.email);
    // @ts-ignore
    if (profile.role === 'admin') {
      // @ts-ignore
      const generatedId = await this.coinsService.insertProduct(
        type,
        name,
        persianName,
        // @ts-ignore
        sign,
        wallet,
        walletTwo,
        buyPrice,
        sellPrice,
        minBuy,
        maxBuy,
        maxSell,
        minSell,
        active,
      );
      return { id: generatedId };
    } else {
      return { status: 401 };
    }
  }

  @Post('/subcoin')
  async addSubCoin(
    @Body('name') name: string,
    @Body('fee') fee: number,
    @Body('active') active: number,
    @Body('sign') sign: string,
    // tslint:disable-next-line:variable-name
    @Body('crypto_id') crypto_id: number,
    @Headers() headers: Headers,
  ) {
    // @ts-ignore
    const token = await headers.authorization.split(' ');
    const user = await this.authService.getUser(token[1]);
    const profile = await this.usersService.getProfile(user.email);
    // @ts-ignore
    if (profile.role === 'admin') {
      // @ts-ignore
      const generatedId = await this.coinsService.insertSubCoin(
        name, fee, active, sign, crypto_id,
      );
      return { id: generatedId };
    } else {
      return { status: 401 };
    }
  }

  @Get()
  @UseGuards(AuthGuard())
  async getAllProducts(@Headers() headers: Headers) {
    // @ts-ignore
    const token = await headers.authorization.split(' ');
    const user = await this.authService.getUser(token[1]);
    const profile = await this.usersService.getProfile(user.email);
    // @ts-ignore
    if (profile.role === 'admin') {
      // @ts-ignore
      // tslint:disable-next-line:no-shadowed-variable
      const token = await headers.authorization.split(' ');
      // tslint:disable-next-line:no-shadowed-variable
      const user = await this.authService.getUser(token[1]);
      // tslint:disable-next-line:no-shadowed-variable
      const profile = await this.usersService.getProfile(user.email);
      // @ts-ignore
      const products = await this.ordersService.getProducts(profile.id);
      return products;
    } else {
      return { status: 401 };
    }
  }

  @Get('/network/single')
  // tslint:disable-next-line:no-empty
  async getOneSubCoinData(@Body('sign') sign: string, @Headers() headers: Headers) {
    // @ts-ignore
    const order = await this.coinsService.getSubCoinsOneCoinWithSign(sign);
    return order;
  }

  @Post('/network/single')
  // tslint:disable-next-line:no-empty
  async getOneSubCoinDataPost(@Body('sign') sign: string, @Headers() headers: Headers) {
    // @ts-ignore
    const order = await this.coinsService.getSubCoinsOneCoinWithSign(sign);
    return order;
  }

  @Get('/single')
  async getProduct(@Body('sign') sign: string, @Headers() headers: Headers) {
    // @ts-ignore
    const order = await this.coinsService.getSingleProduct(sign);
    return order;
  }

  @Post('/single')
  async getProductPost(@Body('sign') sign: string, @Headers() headers: Headers) {
    // @ts-ignore
    const order = await this.coinsService.getSingleProduct(sign);
    return order;
  }

  @Get('/all')
  async getAllCoins() {
    // @ts-ignore
    const coins = await this.coinsService.getProducts();
    return coins;
  }

  @Get('/network/all')
  // tslint:disable-next-line:variable-name
  async getAllNetworksOneCoin(@Body('crypto_id') crypto_id: number, @Headers() headers: Headers) {
    // @ts-ignore
    const getNetworks = await this.coinsService.getSubCoinsOneCoin(crypto_id);
    return getNetworks;
  }

  @Post('/network/all')
  // tslint:disable-next-line:variable-name
  async getAllNetworksOneCoinPost(@Body('crypto_id') crypto_id: number, @Headers() headers: Headers) {
    // @ts-ignore
    const getNetworks = await this.coinsService.getSubCoinsOneCoin(crypto_id);
    return getNetworks;
  }

  @Get('/exir/prices')
  // tslint:disable-next-line:variable-name
  async getExir() {

    const { Kit } = require('hollaex-node-lib');
    const client = new Kit({
      apiURL: this.configService.get<string>('API_URL_EXIR'),
      baseURL: this.configService.get<string>('API_BASE_EXIR'),
      apiKey: this.configService.get<string>('API_KEY_PUBLIC_EXIR'),
      apiSecret: this.configService.get<string>('API_KEY_PRIVATE_EXIR'),
    });

    const orderbookUsdt = await client.getOrderbooks('usdt-irt');
    const bidsUsdt = orderbookUsdt['usdt-irt'].bids[0][0];  // kharidaran
    const asksUsdt = orderbookUsdt['usdt-irt'].asks[0][0];  // foroshandegan

    // get profit coin
    const usdt = await this.coinsService.getSingleProduct('usdt');
    const profit = usdt.sos;

    // update on db
    // @ts-ignore
    this.coinsService.updatePrice('usdt', ((profit / 100) * bidsUsdt + bidsUsdt).toFixed(0),
      ((profit / 100) * asksUsdt + asksUsdt).toFixed(0));
    const usdtFinal = await this.coinsService.getSingleProduct('usdt');

    // tslint:disable-next-line:max-line-length
    await this.telegram.sendMessage({
      chat_id: '-517435294',
      // @ts-ignore
      // tslint:disable-next-line:max-line-length
      text: 'Usdt buy : ' + usdtFinal.buyPrice.toLocaleString(undefined, { maximumFractionDigits: 2 }) + '   sell : ' + usdtFinal.sellPrice.toLocaleString(undefined, { maximumFractionDigits: 2 }),
    }).toPromise();

    return usdtFinal;

  }

  @Cron('*/30 * * * * *')
  runEvery30Seconds() {
    if (this.configService.get<string>('MODE') !== 'dev') {
      // tslint:disable-next-line:no-console
      console.log('Prices Updated');
      this.getExir();
    }
  }

  // @Get('/send/trx')
  // tslint:disable-next-line:variable-name
  async sendtrx() {
    // @ts-ignore
    const { Kit } = require('hollaex-node-lib');
    const client = new Kit({
      apiURL: this.configService.get<string>('API_URL_EXIR'),
      baseURL: this.configService.get<string>('API_BASE_EXIR'),
      apiKey: this.configService.get<string>('API_KEY_PUBLIC_EXIR'),
      apiSecret: this.configService.get<string>('API_KEY_PRIVATE_EXIR'),
    });

    const send = await client.requestWithdrawal('trx', 94, 'addr', 'TRC20');
    return send;
  }

}
