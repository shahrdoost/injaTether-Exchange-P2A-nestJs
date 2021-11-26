import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `${token}`;

    await this.mailerService.sendMail({
      to: user.email,
       from: '"اینجاتتر" <info@widefolio.com>', // override default from
      subject: 'کد تایید حساب ایمیل شما',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: user.name,
        url,
      },
    });
  }
}
