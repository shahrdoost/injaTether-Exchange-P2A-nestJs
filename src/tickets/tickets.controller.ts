import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
  Param,
  Headers,
  Injectable,
  Inject,
  forwardRef,
  UseInterceptors,
  UploadedFile,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { TicketsService } from './tickets.service';
import { AuthGuard } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Ticket } from './ticket.interface';
import { Comment } from './comment.interface';
import { AuthService } from '../auth/auth.service';
import { MailService } from '../mail/mail.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { storage } from './storage';
// tslint:disable-next-line:no-var-requires
const Kavenegar = require('kavenegar');
// @ts-ignore
import { AppConfig } from '../app.config';
import * as bcrypt from 'bcrypt';
import has = Reflect.has;
import { HttpService } from '@nestjs/axios';
import { RavenInterceptor } from 'nest-raven';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';

@Injectable()
@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService,
              @Inject(forwardRef(() => AuthService)) private authService: AuthService,
              private mailService: MailService,
              private readonly appConfig: AppConfig,
              private httpService: HttpService,
              private usersService: UsersService,
  ) {

  }

  @Post()
  @UseGuards(AuthGuard())
  // @ts-ignore
  async create(@Body('title') title: string,
               @Body('message') message: string,
               @Headers() headers: Headers): Promise<any> {

    // throw new HttpException('Internal fucking error', HttpStatus.INTERNAL_SERVER_ERROR);
    try {
      // @ts-ignore
      const token = await headers.authorization.split(' ');
      const user = await this.authService.getUser(token[1]);
      const profile = await this.usersService.getProfile(user.email);

      // @ts-ignore
      const result = await this.ticketsService.create(title, message, profile.id);
      // @ts-ignore
      const sendFirstCm = await this.ticketsService.createComment(null, message, profile.id, result.id);

    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err);
      // tslint:disable-next-line:no-console
      throw new HttpException('Internal console error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/comment/next')
  @UseGuards(AuthGuard())
  // tslint:disable-next-line:variable-name
  async createCommentNext(@Body('ticket_id') ticket_id: string,
                          @Body('text') text: string,
                          @Body('image') image: string,
                          @Headers() headers: Headers) {
    try {
      // @ts-ignore
      const token = await headers.authorization.split(' ');
      const user = await this.authService.getUser(token[1]);
      const profile = await this.usersService.getProfile(user.email);

      const checkuserId = await this.ticketsService.findOneByTicketId(ticket_id);
      // @ts-ignore
      if (checkuserId.user_id === profile.id) {
        // @ts-ignore
        const result = await this.ticketsService.insertComment(text, image, profile.id, ticket_id);
        return {
          status: 201,
        };
      } else {
        return {
          status: 401,
        };
      }

    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err);
    }
  }

  @Post('/all')
  @UseGuards(AuthGuard())
  // tslint:disable-next-line:variable-name
  async GetallTickets(@Headers() headers: Headers) {
    try {
      // @ts-ignore
      const token = await headers.authorization.split(' ');
      const user = await this.authService.getUser(token[1]);
      const profile = await this.usersService.getProfile(user.email);
      // @ts-ignore
      return await this.ticketsService.findAllTicket(profile.id);

    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err);
    }
  }

  @Post('/comment/all')
  @UseGuards(AuthGuard())
  // tslint:disable-next-line:variable-name
  async GetallComments(@Headers() headers: Headers, @Body('ticket_id') ticket_id: string) {
    try {
      // @ts-ignore
      const token = await headers.authorization.split(' ');
      const user = await this.authService.getUser(token[1]);
      const profile = await this.usersService.getProfile(user.email);

      const checkuserId = await this.ticketsService.findOneByTicketId(ticket_id);
      // @ts-ignore
      if (checkuserId.user_id === profile.id) {
        return  await this.ticketsService.findAllCommet(ticket_id);
      } else {
        return {
          status: 401,
        };
      }

    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err);
    }
  }

  async checkToken(token, hash) {

    const match = await bcrypt.compare(token, hash);
    return match;
  }

}
