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
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Model } from 'mongoose';
import { User } from './user.interface';
import { AuthService } from '../auth/auth.service';
import { MailService } from '../mail/mail.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname, join } from 'path';
import { storage } from './storage';
// tslint:disable-next-line:no-var-requires
const Kavenegar = require('kavenegar');
// @ts-ignore
import { AppConfig } from '../app.config';
import * as bcrypt from 'bcrypt';
import has = Reflect.has;
import { TelegramService } from 'nestjs-telegram';

@Injectable()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService,
              @Inject(forwardRef(() => AuthService)) private authService: AuthService,
              private mailService: MailService,
              private readonly appConfig: AppConfig,
              // @ts-ignore
              private readonly telegram: TelegramService,
  ) {

  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {

    try {
      const result = await this.usersService.create(createUserDto);

      // tslint:disable-next-line:max-line-length
      await this.telegram.sendMessage({
        chat_id: 'chatid',
        // @ts-ignore
        text: ' کاربر جدید با ایمیل ' + result.email + ' با همراه ' + result.phone + ' عضو شد ',
      }).toPromise();
      return result;
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err);
      if (err.code === 11000) {
        throw new HttpException('duplicated', HttpStatus.FORBIDDEN);
      }
    }

  }

  // @ts-ignore
  async telegram() {
    return await this.telegram.sendMessage({ chat_id: 'chatid', text: '123' });

  }

  @Post('kyc')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor(
      'nationalId', // name of the field being passed
      {
        storage,
        // tslint:disable-next-line:only-arrow-functions
        fileFilter(req, file, cb) {
          switch (file.mimetype) {
            case 'image/png':
              return cb(null, true);
              break;
            case 'image/jpeg':
              return cb(null, true);
              break;
            default:
              // @ts-ignore
              return cb('notcorrectfile', false);
          }
        },
      },
    ))

  async updateProduct(
    @Body('name') name: string,
    @Body('homeNumber') homeNumber: string,
    @Body('birthDate') birthDate: string,
    @Body('nationalId') nationalId: string,
    @Body('address') address: string,
    @Body('introducer') introducer: string,
    @Headers() headers: Headers, @UploadedFile() file) {
    /*await this.productsService.updateProduct(prodId, prodTitle, prodDesc, prodPrice);
    return null;*/
    return file;
    // @ts-ignore
    const token = await headers.authorization.split(' ');
    const user = await this.authService.getUser(token[1]);
    const profile = await this.usersService.getProfile(user.email);

    return profile;
  }

  // @ts-ignore
  @Post('kyc/nationalId')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor(
      'nationalId', // name of the field being passed
      {
        storage,
        fileFilter(req, file, cb) {
          switch (file.mimetype) {
            case 'image/png':
              return cb(null, true);
              break;
            case 'image/jpeg':
              return cb(null, true);
              break;
            default:
              // @ts-ignore
              return cb('notcorrectfile', false);
          }
        },
      },
    ))

  async setNationalId_Image(
    // @ts-ignore
    @Headers() headers: Headers, @UploadedFile() file) {
    // @ts-ignore
    const token = await headers.authorization.split(' ');
    const user = await this.authService.getUser(token[1]);
    const profile = await this.usersService.getProfile(user.email);

    /*const fs = require('fs');
    // tslint:disable-next-line:only-arrow-functions
    return fs.readFile(join('nestExchange' , '..', 'uploads/kyc/1628845513516.jpeg'), function(err, data) {
      if (err) { throw err; }
      console.log(data.toString('base64'));
      return data.toString('base64');
    });*/

    // @ts-ignore
    await this.usersService.updateSetNationalId_Image(profile.id, file);
    // tslint:disable-next-line:max-line-length
    // @ts-ignore
    // tslint:disable-next-line:max-line-length
   // await this.telegram.sendPhoto({
   //   chat_id: 'chatid',
   //   caption: '  کاربر ' + profile.email + ' عکس کارت ملی آپلود کرد ',
   //   photo: 'https://api.injatether.com/uploadsssssssssefwgweh/kyc/' + file.filename,
   // }).toPromise();

    return {
      status: 201,
    };
  }

  @Post('kyc/selfi')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor(
      'selfi', // name of the field being passed
      {
        storage,
        fileFilter(req, file, cb) {
          switch (file.mimetype) {
            case 'image/png':
              return cb(null, true);
              break;
            case 'image/jpeg':
              return cb(null, true);
              break;
            default:
              // @ts-ignore
              return cb('notcorrectfile', false);
          }
        },
      },
    ))

  async setselfi_Image(
    @Headers() headers: Headers, @UploadedFile() file) {

    // @ts-ignore
    const token = await headers.authorization.split(' ');
    const user = await this.authService.getUser(token[1]);
    const profile = await this.usersService.getProfile(user.email);

    // @ts-ignore
    await this.usersService.updateSetselfi_Image(profile.id, file);
    // tslint:disable-next-line:max-line-length
    await this.telegram.sendPhoto({
      chat_id: 'chatid',
      caption: '  کاربر ' + profile.email + ' عکس سلفی آپلود کرد ',
      photo: 'https://api.injatether.com/uploadsssssssssefwgweh/kyc/' + file.filename,
    }).toPromise();
    return {
      status: 201,
    };
  }

  @Get('kyc/send/email')
  @UseGuards(AuthGuard())
  async SendEmailVerification(
    @Headers() headers: Headers) {
    // @ts-ignore
    const token = await headers.authorization.split(' ');
    const user = await this.authService.getUser(token[1]);
    const profile = await this.usersService.getProfile(user.email);

    // update db token
    // @ts-ignore
    // tslint:disable-next-line:no-shadowed-variable no-empty
    const saltRounds = 10;
    const myPlaintextPassword = await this.getRandomIntInclusive(10000000000, 20000000000).toString();
    await bcrypt.genSalt(saltRounds, async (err, salt) => {
      // tslint:disable-next-line:no-shadowed-variable
      await bcrypt.hash(myPlaintextPassword, salt, async (err, hash) => {
        // @ts-ignore
        await this.usersService.updateTokenEmail(hash, profile.id);
      });
    });
    // send confirmation mail
    // @ts-ignore
    await this.mailService.sendUserConfirmation(profile, myPlaintextPassword);
    return profile;
  }

  @Get('kyc/send/sms')
  @UseGuards(AuthGuard())
  async SendSmsVerification(
    @Headers() headers: Headers) {
    // @ts-ignore
    const token = await headers.authorization.split(' ');
    const user = await this.authService.getUser(token[1]);
    const profile = await this.usersService.getProfile(user.email);

    // update db token
    // @ts-ignore
    // tslint:disable-next-line:no-shadowed-variable no-empty
    const saltRounds = 10;
    await bcrypt.genSalt(saltRounds, async (err, salt) => {
      const myPlaintextPassword = await this.getRandomIntInclusive(10000000000, 20000000000).toString();
      // tslint:disable-next-line:no-shadowed-variable
      await bcrypt.hash(myPlaintextPassword, salt, async (err, hash) => {
        // @ts-ignore
        // tslint:disable-next-line:no-console
        console.log(myPlaintextPassword);
        // @ts-ignore
        await this.usersService.updateTokenSms(hash, profile.id);
      });
    });
    // send confirmation mail
    // @ts-ignore
    /*const api = await Kavenegar.KavenegarApi({
      apikey: 'api',
    });
    api.Send({
        message: 'کد عضویت شما در اینجاتتر',
        // @ts-ignore
        receptor: profile.phone,
      },
      // tslint:disable-next-line:only-arrow-functions
      function(response, status) {
        // tslint:disable-next-line:no-console
        console.log(response);
        // tslint:disable-next-line:no-console
        console.log(status);
      });*/
  }

  // @ts-ignore
  @Post('kyc/check/sms')
  @UseGuards(AuthGuard())
  async VerifySmsToken(
    @Headers() headers: Headers,
    // @ts-ignore
    @Body('token') token: string) {
    // @ts-ignore
    const tokenLogin = await headers.authorization.split(' ');
    const user = await this.authService.getUser(tokenLogin[1]);
    const profile = await this.usersService.getProfile(user.email);

    // if empty
    if (token === '') {
      return {
        status: false,
      };
    }
    // check token
    // @ts-ignore
    // tslint:disable-next-line:only-arrow-functions
    const hash = await profile.token_sms;
    const check = this.checkToken(token, hash);
    // tslint:disable-next-line:only-arrow-functions
    return check.then((result) => {
      if (result === true) {
        // @ts-ignore
        this.usersService.updateStatusSms(profile.id);
      }
      return {
        status: result,
      };
    });

  }

  // @ts-ignore
  @Post('kyc/check/email')
  @UseGuards(AuthGuard())
  async VerifyEmailToken(
    @Headers() headers: Headers,
    // @ts-ignore
    @Body('token') token: string) {
    // @ts-ignore
    const tokenLogin = await headers.authorization.split(' ');
    const user = await this.authService.getUser(tokenLogin[1]);
    const profile = await this.usersService.getProfile(user.email);

    // if empty
    if (token === '') {
      return {
        status: false,
      };
    }
    // check token
    // @ts-ignore
    // tslint:disable-next-line:only-arrow-functions
    const hash = await profile.token_email;
    const check = this.checkToken(token, hash);
    // tslint:disable-next-line:only-arrow-functions
    return check.then((result) => {
      if (result === true) {
        // @ts-ignore
        this.usersService.updateStatusEmail(profile.id);
      }
      return {
        status: result,
      };
    });
  }

  // @ts-ignore
  @Post('kyc/check/final')
  @UseGuards(AuthGuard())
  async VerifyFinalCheck(
    @Headers() headers: Headers,
    // @ts-ignore
    @Body('token') token: string,
    @Body('name') name: string,
    @Body('lastName') lastName: string,
    @Body('homeNumber') homeNumber: string,
    @Body('BirthDate') BirthDate: string,
    @Body('nationalId') nationalId: string,
    @Body('city') city: string,
    @Body('address') address: string,
  ) {

    // @ts-ignore
    const tokenLogin = await headers.authorization.split(' ');
    const user = await this.authService.getUser(tokenLogin[1]);
    const profile = await this.usersService.getProfile(user.email);

    if (token === '') {
      return {
        status: false,
      };
    }
    // if empty
    if (name === undefined
      || lastName === undefined || homeNumber === undefined
      || BirthDate === undefined || nationalId === undefined
      || city === undefined || address === undefined
    ) {
      return {
        status: false,
      };
    }
    // if empty
    if (name === undefined
      && lastName === undefined && homeNumber === undefined
      && BirthDate === undefined && nationalId === undefined
      && city === undefined && address === undefined
    ) {
      return {
        status: false,
      };
    }
    // update db
    // @ts-ignore
    await this.usersService.updateFinalCheck(profile.id, name, lastName, homeNumber, BirthDate, nationalId, city, address);
    return {
      status: true,
    };
  }

  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async checkToken(token, hash) {

    const match = await bcrypt.compare(token, hash);
    return match;
  }

}
