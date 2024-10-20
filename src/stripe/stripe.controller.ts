import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FUser } from 'src/auth/decorator/user.decorator';
import { UserSecure } from 'src/auth/decorator/secure.decorator';
import { StripeCommissionDto } from './dto/stripe-comission.dto';

@Controller('stripe')
@ApiBearerAuth()
@UserSecure()
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Get()
  getStripeAccountLink(@FUser() user) {
    return this.stripeService.createOrGetStripeAccount(user._id.toString());
  }

  @Post('commission/:id')
  setStripeComission(
    @Param('id') siteId: string,
    @Body() commissionDto: StripeCommissionDto,
  ) {
    return this.stripeService.setStripeCommission(siteId, commissionDto);
  }
}
