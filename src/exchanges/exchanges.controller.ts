import { Body, Controller, forwardRef, Headers, Inject, Post, Get } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import {ExchangesService} from './exchanges.service';
@Controller('exchanges')
export class ExchangesController {
  constructor(private httpService: HttpService, private exchangeService: ExchangesService) {
  }

  @Get('/ray')
  async Ray(){
    return this.exchangeService.findAll();
  }

  @Get('/prices')
  // tslint:disable-next-line:variable-name no-empty
  async GetRayPrices() {

  }

  @Get('/tht')
  // tslint:disable-next-line:variable-name
  async GetTetherland() {
    return this.httpService.get('https://tetherland.net/data/api/v2/tether_sellprice', {
      headers: {
        Accept: 'application/json',
      },
    }).pipe(
      map(response => response.data),
    );
  }

}
