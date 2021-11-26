import { Module, forwardRef } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { TicketSchema } from './ticket.schema';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { CommentSchema } from './comments.schema';
import { HttpModule } from '@nestjs/axios';
import { AppService } from '../app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RavenInterceptor, RavenModule } from 'nest-raven';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{
      name: 'Ticket',
      schema: TicketSchema,
    }]),
    MongooseModule.forFeature([{
      name: 'Comment',
      schema: CommentSchema,
    }]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    forwardRef(() => AuthModule),
    MailModule,
    RavenModule,
    UsersModule,
  ],
  exports: [TicketsService],
  controllers: [TicketsController],
  providers: [TicketsService,
    {
      provide: APP_INTERCEPTOR,
      useValue: new RavenInterceptor(),
    }],
})
export class TicketsModule {
}
