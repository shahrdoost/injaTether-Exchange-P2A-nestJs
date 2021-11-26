import { Module, forwardRef } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from './user.schema';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { TelegramModule } from 'nestjs-telegram';

@Module({
  imports: [
    MongooseModule.forFeature([{
        name: 'User',
        schema: UserSchema,
      }]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    forwardRef(() => AuthModule),
    MailModule, TelegramModule.forRoot({
      botKey: 'token',
    }),
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {
}
