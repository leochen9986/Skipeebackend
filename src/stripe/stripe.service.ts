import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Site } from 'src/sites/schemas/sites.schema';
import { User } from 'src/users/schemas/user.schema';
import Stripe from 'stripe';
import { StripeCommissionDto } from './dto/stripe-comission.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class StripeService {
  stripe: Stripe;
  constructor(
    @InjectModel(Site.name) private readonly siteModel: Model<Site>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly emailService: EmailService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }

  async setStripeCommission(siteId: string, commissionDto: StripeCommissionDto) {
    const site = await this.siteModel.findById(siteId);
    if (!site) {
      throw new HttpException('Site not found', HttpStatus.NOT_FOUND);
    }
  
    // Update commission settings
    if (commissionDto.minCommission !== undefined) {
      site.minCommission = commissionDto.minCommission;
    }
    if (commissionDto.maxCommission !== undefined) {
      site.maxCommission = commissionDto.maxCommission;
    }
    if (commissionDto.percentageCommission !== undefined) {
      site.percentageCommission = commissionDto.percentageCommission;
    }
    if (commissionDto.baseCommission !== undefined) {
      site.baseCommission = commissionDto.baseCommission;
    }
  
    // Update skipping and ticketing settings
    if (commissionDto.skipping !== undefined) {
      site.skipping = commissionDto.skipping;
    }
    if (commissionDto.ticketing !== undefined) {
      site.ticketing = commissionDto.ticketing;
    }
  
    // Ensure minCommission is not greater than maxCommission
    if (site.minCommission > site.maxCommission) {
      throw new HttpException(
        'Minimum commission cannot be greater than maximum commission',
        HttpStatus.BAD_REQUEST,
      );
    }
  
    try {
      await site.save();
      // this.emailService.sendEmail(
      //   site.email,
      //   'Commission and Settings Updated',
      //   'Your commission and settings have been updated',
      //   `
      //       <p><strong>Hi, ${site.name} </strong></p>
      //       <p> Your commission and settings have been updated. </p>
      //       <p> The new settings are: </p>
      //       <ul>
      //           <li>Minimum fee: ${site.minCommission}</li>
      //           <li>Maximum fee: ${site.maxCommission}</li>
      //           <li>Percentage fee: ${site.percentageCommission}</li>
      //           <li>Base (Fixed) fee: ${site.baseCommission}</li>
      //           <li>Skipping: ${site.skipping}</li>
      //           <li>Ticketing: ${site.ticketing}</li>
      //       </ul>
      //       <br/>
      //       <p> Thank you for using Skipee. </p>
      //       <p> Skipee Team </p>
      //   `,
      // );
      return site;
    } catch (error) {
      throw new HttpException(
        'Failed to update commission and settings',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createOrGetStripeAccount(userId: string) {
    const user = await this.userModel.findById(userId);
    const site = await this.siteModel.findById(user.worksIn);
    if (!site) {
      throw new HttpException('Site not found', HttpStatus.NOT_FOUND);
    }
    let dashboardLink = null;
    if (site.stripeAccountId) {
      const accountLink = await this.createAccountLink(site.stripeAccountId);
      const account = await this.stripe.accounts.retrieve(site.stripeAccountId);

      const canAcceptPayments =
        account.details_submitted &&
        account.charges_enabled &&
        account.payouts_enabled &&
        account.requirements.currently_due.length === 0;

      if (canAcceptPayments)
        dashboardLink = await this.getStripeDashboardLink(site.stripeAccountId);

      return { canAcceptPayments, account, accountLink, dashboardLink };
    }
    // Create new account
    const account = await this.stripe.accounts.create({
      type: 'express',
      email: site.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    site.stripeAccountId = account.id;
    await site.save();

    const accountLink = await this.createAccountLink(account.id);
    const canAcceptPayments =
      account.details_submitted &&
      account.charges_enabled &&
      account.payouts_enabled &&
      account.requirements.currently_due.length === 0;

    if (canAcceptPayments)
      dashboardLink = await this.getStripeDashboardLink(account.id);

    return { canAcceptPayments, account, accountLink, dashboardLink };
  }

  async getStripeDashboardLink(accoutnId: string): Promise<string> {
    const link = await this.stripe.accounts.createLoginLink(accoutnId);
    return link.url;
  }

  private async createAccountLink(accountId: string) {
    const link = await this.stripe.accountLinks.create({
      account: accountId,
      refresh_url: `http://104.248.165.72:3000//#/manage-account`,
      return_url: `http://104.248.165.72:3000//#/manage-account`,
      type: 'account_onboarding',
    });

    return link.url;
  }
}
