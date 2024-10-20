import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from 'src/users/schemas/user.schema';

export class CreateUserDto {
  @ApiProperty({ required: true, example: 'John Doe' })
  name: string;

  @ApiProperty({ required: true, example: 'johndoe' })
  email: string;

  @ApiProperty({ required: true, example: 'password123' })
  password: string;

  @ApiProperty({ required: true, example: 'user' })
  role: UserRoles;

  @ApiProperty({ required: false, example: '0240u34nwendiwnciwec' })
  worksIn: string;

  @ApiProperty({ required: false, default: false, example: true })
  isActive: boolean;
}
