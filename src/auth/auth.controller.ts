import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags,ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserSecure } from './decorator/secure.decorator';
import { FUser } from './decorator/user.decorator';
import { User } from 'src/users/schemas/user.schema';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Get('users')
  @ApiBearerAuth()
  @UserSecure()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ type: [User] })
  async getAllUsers(@FUser() user): Promise<User[]> {
    if (user.role !== 'admin') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return this.authService.getAllUsers();
  }




  @Post('login')
  @ApiOperation({ summary: 'Login an existing user' })
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password' },
      },
    },
  })
  login(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.login(email, password);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password' })
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string', example: 'user@example.com' },
      },
    },
  })
  forgotPassword(
    @Body('email') email: string,
    @Headers('origin') host: string,
  ) {
    return this.authService.forgotPassword(email, host);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({
    schema: {
      properties: {
        token: { type: 'string', example: 'token' },
        password: { type: 'string', example: 'password' },
      },
    },
  })
  resetPassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ) {
    return this.authService.resetPassword(token, password);
  }

  @Get()
  @ApiBearerAuth()
  @UserSecure()
  @ApiOperation({ summary: 'Get user information' })
  sayHello(@FUser() user) {
    return user;
  }
}
