import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLogin } from './dtos/adminLogin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  loginAdmin(@Body() data: AdminLogin) {
    return this.adminService.login(data);
  }
}
