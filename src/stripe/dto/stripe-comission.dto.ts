import { IsNumber, IsOptional ,IsBoolean} from 'class-validator';

export class StripeCommissionDto {
  @IsNumber()
  @IsOptional()
  minCommission?: number;

  @IsNumber()
  @IsOptional()
  maxCommission?: number;

  @IsNumber()
  @IsOptional()
  percentageCommission?: number;

  @IsNumber()
  @IsOptional()
  baseCommission?: number;
  

  @IsOptional()
  @IsBoolean()
  skipping?: boolean;

  @IsOptional()
  @IsBoolean()
  ticketing?: boolean;

}
