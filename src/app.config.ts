import { Env } from 'nestjs-env';

export class AppConfig {
  @Env('PORT', {default: 3000})
  port: number;

  @Env('NODE_ENV', {default: 'development'})
  env: string;

  @Env('KAVENEGAR', {default: 'apikavehnegar'})
  kavenegar: string;

  @Env('MAIL_HOST', {default: 'smtp.gmail.com'})
  mailHost: string;

  @Env('APP_URL', {default: 'http://localhost.com'})
  appUrl: string;

  get isDevelopment() {
    return this.env === 'development';
  }
}
