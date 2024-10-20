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
exports.UsersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const user_decorator_1 = require("../auth/decorator/user.decorator");
const update_user_dto_1 = require("./dto/update-user.dto");
const swagger_1 = require("@nestjs/swagger");
const secure_decorator_1 = require("../auth/decorator/secure.decorator");
const user_schema_1 = require("./schemas/user.schema");
const user_request_1 = require("./schemas/user-request");
const public_decorator_1 = require("../auth/decorator/public.decorator");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    getMyProfile(user) {
        return this.usersService.getUser(user._id);
    }
    updateMyProfile(user, updateUserDto) {
        return this.usersService.updateMyProfile(user._id, updateUserDto);
    }
    deleteUserById(id) {
        return this.usersService.deleteUser(id);
    }
    deleteMyProfile(user) {
        return this.usersService.deleteUser(user._id);
    }
    requestUser(email, organizerName) {
        return this.usersService.requestUser(email, organizerName);
    }
    getUserRequests(user) {
        if (user.role === 'admin')
            return this.usersService.getUserRequests();
        return new common_1.HttpException('Unauthorized', 401);
    }
    async approveUserRequest(id, user) {
        if (user.role === 'admin')
            return this.usersService.approveUserRequest(id);
        return new common_1.HttpException('Unauthorized', 401);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get my profile',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'User profile',
        type: user_schema_1.User,
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, user_decorator_1.FUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Patch)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update my profile',
    }),
    (0, swagger_1.ApiBody)({
        type: update_user_dto_1.UpdateUserDto,
        required: true,
        description: 'User data to update',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Updated user profile',
        type: user_schema_1.User,
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, user_decorator_1.FUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateMyProfile", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete user by id',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'User deleted',
        type: secure_decorator_1.UserSecure,
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'User id',
        type: String,
        required: true,
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deleteUserById", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete my profile',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'User deleted',
        type: secure_decorator_1.UserSecure,
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, user_decorator_1.FUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deleteMyProfile", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('/request'),
    (0, swagger_1.ApiOperation)({
        summary: 'Request user',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'User join requested',
        type: user_request_1.UserRequests,
    }),
    (0, swagger_1.ApiBody)({
        type: String,
        required: true,
        description: 'User email to request',
    }),
    openapi.ApiResponse({ status: 201, type: String }),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('organizerName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "requestUser", null);
__decorate([
    (0, common_1.Get)('/request'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user requests',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'User join requests',
        type: [user_request_1.UserRequests],
    }),
    __param(0, (0, user_decorator_1.FUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getUserRequests", null);
__decorate([
    (0, common_1.Get)('/approve-request/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Approve user join request',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'User join approved',
        type: user_request_1.UserRequests,
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'User join request id',
        type: String,
        required: true,
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.FUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "approveUserRequest", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, secure_decorator_1.UserSecure)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map