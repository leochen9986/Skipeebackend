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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtGuard = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth.service");
const core_1 = require("@nestjs/core");
const public_decorator_1 = require("./public.decorator");
let JwtGuard = class JwtGuard {
    constructor(authService, reflector) {
        this.authService = authService;
        this.reflector = reflector;
    }
    async canActivate(context) {
        try {
            const request = context.switchToHttp().getRequest();
            const { authorization } = request.headers;
            const isPublic = this.reflector.get(public_decorator_1.IS_PUBLIC_KEY, context.getHandler());
            if (isPublic) {
                return true;
            }
            if (!authorization || authorization.trim() === '') {
                throw new common_1.UnauthorizedException('Please provide token');
            }
            const authToken = authorization.replace(/bearer/gim, '').trim();
            const resp = await this.authService.validateUser(authToken);
            request.user = resp;
            return true;
        }
        catch (error) {
            console.log('auth error - ', error.message);
            throw new common_1.ForbiddenException(error.message || 'session expired! Please sign In');
        }
    }
};
exports.JwtGuard = JwtGuard;
exports.JwtGuard = JwtGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        core_1.Reflector])
], JwtGuard);
//# sourceMappingURL=jwt.guard.js.map