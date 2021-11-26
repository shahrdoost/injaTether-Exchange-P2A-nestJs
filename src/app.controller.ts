import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';
import { AppConfig } from './app.config';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly appConfig: AppConfig) {
  }

  @Get()
  @Header('Content-Type', 'text/html')
  getHello(): {name: string} {
    return {name: 'inja-1400-6-30 9:10'};
  }
}
