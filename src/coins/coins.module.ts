import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CoinsController } from './coins.controller';
import { CoinsService } from './coins.service';
import { CoinSchema } from './coin.model';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { SubCoinSchema } from './subcoins.schema';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from '../mail/mail.module';
import { TelegramModule } from 'nestjs-telegram';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Coin', schema: CoinSchema }]),
    MongooseModule.forFeature([{ name: 'SubCoin', schema: SubCoinSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    UsersModule , AuthModule , ConfigModule, TelegramModule.forRoot({
      botKey: '1856986630:AAH6n3vMusJoJZuVsbEbQ05cU3QXW1avhWQ',
    }),
  ],
  controllers: [CoinsController],
  providers: [CoinsService],
  exports: [CoinsService],
})
export class CoinsModule {}
