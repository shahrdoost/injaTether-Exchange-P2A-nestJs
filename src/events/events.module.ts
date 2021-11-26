import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { CoinsModule } from '../coins/coins.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CoinSchema } from '../coins/coin.model';
import { EventsService } from './events.service';
import { CoinsService } from '../coins/coins.service';

@Module({
  imports: [  MongooseModule.forFeature([{ name: 'Coin', schema: CoinSchema }]),
    CoinsModule, UsersModule , AuthModule, CoinsModule],
  providers: [EventsGateway, EventsService],
  exports: [EventsGateway, EventsService],
})
export class EventsModule {}
