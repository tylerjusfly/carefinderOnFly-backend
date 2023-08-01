import { Injectable } from '@nestjs/common';
import { AdminLogin } from './dtos/adminLogin.dto';

@Injectable()
export class AdminService {
  async login(data: AdminLogin) {
    return { success: true, result: `${data.username} has password ${data.password}` };
  }
}
