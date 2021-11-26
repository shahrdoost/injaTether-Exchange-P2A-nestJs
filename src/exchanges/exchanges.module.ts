import { forwardRef, Module } from '@nestjs/common';
import { ExchangesController } from './exchanges.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import {ExchangesService} from './exchanges.service';

import { ExchangeSchema } from './exchanges.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: 'Exchange',
      schema: ExchangeSchema,
    }]),
  ],
  controllers: [ExchangesController],
  providers: [ExchangesService],
})
// @ts-ignore
export class ExchangesModule {
}
