import { MailerService } from '@nestjs-modules/mailer';
export declare class EmailService {
    private readonly mailService;
    constructor(mailService: MailerService);
    sendEmail(to: string, subject: string, text: string, html: string): Promise<any>;
}
