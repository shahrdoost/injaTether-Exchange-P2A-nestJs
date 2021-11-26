import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderSchema } from './order.model';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { AuthController } from '../auth/auth.controller';
import { CardsModule } from '../cards/cards.module';
import { ConfigModule } from '@nestjs/config';
import { CoinsModule } from '../coins/coins.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    UsersModule , AuthModule , CardsModule , ConfigModule , CoinsModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
