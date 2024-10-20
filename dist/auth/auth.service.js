"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/users.service");
const email_service_1 = require("../email/email.service");
let AuthService = class AuthService {
    constructor(userModel, jwtService, userService, emailService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.userService = userService;
        this.emailService = emailService;
    }
    async register(createUserDto) {
        const { email, password } = createUserDto;
        if (createUserDto.role === 'manager') {
            const request = await this.userService.getUserRequest(email);
            if (!request) {
                throw new common_1.HttpException('You are not autorized to register', common_1.HttpStatus.UNAUTHORIZED);
            }
            if (request.approved === false) {
                throw new common_1.HttpException('Your join request is not approved yet', common_1.HttpStatus.FORBIDDEN);
            }
            if (request.organizerName.toLowerCase() !== createUserDto.name.toLowerCase()) {
                throw new common_1.HttpException('Your approved organizer name does not match', common_1.HttpStatus.UNAUTHORIZED);
            }
        }
        const user = await this.userModel.findOne({ email });
        if (user) {
            throw new common_1.HttpException('User already exists', common_1.HttpStatus.CONFLICT);
        }
        if (password.length < 8) {
            throw new common_1.HttpException('Password must be at least 8 characters long', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(email)) {
            throw new common_1.HttpException('Invalid email', common_1.HttpStatus.NOT_ACCEPTABLE);
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
        const token = this.jwtService.sign({
            email: createdUser.email,
            _id: createdUser._id,
            role: createdUser.role,
        }, { secret: jwtSecretKey });
        return { user: createdUser, token };
    }
    async login(email, password) {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.UNAUTHORIZED);
        }
        user.password = '';
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = this.jwtService.sign({
            email: user.email,
            _id: user._id,
            role: user.role,
        }, { secret: jwtSecretKey });
        return { user, token };
    }
    async validateUser(token) {
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const decoded = this.jwtService.verify(token, { secret: jwtSecretKey });
        const user = await this.userModel.findById(decoded._id);
        await this.userModel.findOneAndUpdate({ _id: decoded._id }, { lastSeen: Date.now() });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    async forgotPassword(email, host) {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = this.jwtService.sign({
            email: user.email,
            _id: user._id,
        }, { secret: jwtSecretKey });
        await this.emailService.sendEmail(email, 'Reset your password', `Click on the link below to reset your password: ${host}/#/reset-password/${token}`, `
      Hi ${user.name},<br/>
      <p> We have received a request to reset your password. Click on the link below to reset your password:</p>
      <p> <a href="${host}/#/reset-password/${token}"> ${host}/#/reset-password/${token} </a></p>
      `);
        return user;
    }
    async resetPassword(token, password) {
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const decoded = this.jwtService.verify(token, { secret: jwtSecretKey });
        const user = await this.userModel.findById(decoded._id);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (password.length < 8) {
            throw new common_1.HttpException('Password must be at least 8 characters long', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const saltOrRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltOrRound);
        await this.userModel.findByIdAndUpdate(decoded._id, {
            password: hashedPassword,
        });
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        users_service_1.UsersService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map