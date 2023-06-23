import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendConfirmEmail(mail: string, token: string) {
    // Call Send mail Service
    await this.mailerService.sendMail({
      to: mail,
      from: '"Support Team" <support@example.com>', // override default 'from'
      subject: 'Welcome Aboard Champ',
      template: './mail',
      context: {
        token: token,
      },
    });
  }
}
