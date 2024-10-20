import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
    constructor(private readonly mailService: MailerService) {}

    sendEmail(to: string, subject: string, text: string, html: string) {
        return this.mailService.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject,
            text,
            html
        })
    }
}
