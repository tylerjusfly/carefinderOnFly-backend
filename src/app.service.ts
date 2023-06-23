import { Injectable } from '@nestjs/common';
import { MailService } from './modules/mail/mail.service';

import { ApiKeyGenerator, HashValue } from './utils/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiKeyUser } from './apikey.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    private mailService: MailService,
    @InjectRepository(ApiKeyUser)
    private apiKeyRepository: Repository<ApiKeyUser>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
  async getApiKey(email: string): Promise<{
    success: boolean;
    message: string | {};
  }> {
    try {
      // check if email already exists
      const emailExist = await this.apiKeyRepository.findOneBy({
        email,
      });

      if (emailExist) {
        return { success: false, message: 'Email already exists' };
      }
      // Generate ApiKey,
      const apiKey = ApiKeyGenerator();

      // Hash Api Key

      // Save mail and api key of user
      const apiKeydata = await this.apiKeyRepository.save({
        email: email,
        apikey: HashValue(apiKey),
      });

      // Send API Key
      await this.mailService.sendConfirmEmail(email, apiKey);

      // Send Mail
      return { success: true, message: `apiKey created is ${apiKey}` };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
