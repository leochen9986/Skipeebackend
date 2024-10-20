import { UseGuards } from '@nestjs/common';
import { JwtGuard } from './jwt.guard';

export function UserSecure() {
  return UseGuards(JwtGuard);
}
