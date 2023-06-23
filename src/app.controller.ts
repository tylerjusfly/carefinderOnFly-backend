import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('developer/apikey')
  getApiKey(@Body('email') email: string): any {
    return this.appService.getApiKey(email);
  }
}
