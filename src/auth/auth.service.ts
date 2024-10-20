import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    if (createUserDto.role === 'manager') {
      const request = await this.userService.getUserRequest(email);
      if (!request) {
        throw new HttpException(
          'You are not autorized to register',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (request.approved === false) {
        throw new HttpException(
          'Your join request is not approved yet',
          HttpStatus.FORBIDDEN,
        );
      }

      if (request.organizerName.toLowerCase() !== createUserDto.name.toLowerCase()) {
        throw new HttpException(
          'Your approved organizer name does not match',
          HttpStatus.UNAUTHORIZED,
        );
        
      }
    }

    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    if (password.length < 8) {
      throw new HttpException(
        'Password must be at least 8 characters long',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
      throw new HttpException('Invalid email', HttpStatus.NOT_ACCEPTABLE);
    }

    const saltOrRound = 10;

    const hashedPassword = await bcrypt.hash(password, saltOrRound);

    createUserDto.password = hashedPassword;

    const createdUser = new this.userModel(createUserDto);
    await createdUser.save();

    if (!createdUser) {
      throw new Error('Failed to create user');
    }

    createdUser.password = '';

    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    const token = this.jwtService.sign(
      {
        email: createdUser.email,
        _id: createdUser._id,
        role: createdUser.role,
      },
      { secret: jwtSecretKey },
    );

    return { user: createdUser, token };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    user.password = '';

    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    const token = this.jwtService.sign(
      {
        email: user.email,
        _id: user._id,
        role: user.role,
      },
      { secret: jwtSecretKey },
    );
    return { user, token };
  }

  async validateUser(token: string) {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    const decoded = this.jwtService.verify(token, { secret: jwtSecretKey });
    const user = await this.userModel.findById(decoded._id);
    await this.userModel.findOneAndUpdate(
      { _id: decoded._id },
      { lastSeen: Date.now() },
    );
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async forgotPassword(email: string, host: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = this.jwtService.sign(
      {
        email: user.email,
        _id: user._id,
      },
      { secret: jwtSecretKey },
    );

    await this.emailService.sendEmail(
      email,
      'Reset your password',
      `Click on the link below to reset your password: ${host}/#/reset-password/${token}`,
      `
      Hi ${user.name},<br/>
      <p> We have received a request to reset your password. Click on the link below to reset your password:</p>
      <p> <a href="${host}/#/reset-password/${token}"> ${host}/#/reset-password/${token} </a></p>
      `,
    );
    return user;
  }

  async resetPassword(token: string, password: string) {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const decoded = this.jwtService.verify(token, { secret: jwtSecretKey });
    const user = await this.userModel.findById(decoded._id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (password.length < 8) {
      throw new HttpException(
        'Password must be at least 8 characters long',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    const saltOrRound = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRound);
    await this.userModel.findByIdAndUpdate(decoded._id, {
      password: hashedPassword,
    });
    return user;
  }
}
