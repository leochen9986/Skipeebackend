import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { Public } from 'src/auth/decorator/public.decorator';

@Controller('email')
@Public()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  sendEmail(@Body('html') html: string) {
    return this.emailService.sendEmail(
      'info@skipee.co.uk',
      //   'tanay.deo388@gmail.com',
      'Contact us form filled',
      'A new Contact us form has been filled please check',
      html,
    );
  }
}
