import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrdersController } from './orders/orders.controller';
import { OrdersModule } from './orders/orders.module';
import { MailModule } from './mail/mail.module';
import { EnvModule } from 'nestjs-env';
import { AppConfig } from './app.config';
import { TicketsModule } from './tickets/tickets.module';
import { ConfigModule , ConfigService  } from '@nestjs/config';
import { RavenInterceptor, RavenModule } from 'nest-raven';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpException } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { CoinsModule } from './coins/coins.module';
import { CardsModule } from './cards/cards.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { ExchangesService } from './exchanges/exchanges.service';
import { ExchangesModule } from './exchanges/exchanges.module';

@Module({
  imports: [
    RavenModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_ADDRESS'),
      }),
      inject: [ConfigService],
    }),
    OrdersModule,
    ScheduleModule.forRoot(),
    MailModule,
    EnvModule.register([ AppConfig ]),
    ConfigModule.forRoot(),
    TicketsModule,
    EventsModule,
    CoinsModule,
    CardsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/kyc/'),
      serveStaticOptions: {
        redirect: false,
        index: false,
      },
    }),
    ExchangesModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_INTERCEPTOR,
      useValue: new RavenInterceptor(),
    },
    ],
})
export class AppModule {
}
