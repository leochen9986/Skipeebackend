"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSecure = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("./jwt.guard");
function UserSecure() {
    return (0, common_1.UseGuards)(jwt_guard_1.JwtGuard);
}
exports.UserSecure = UserSecure;
//# sourceMappingURL=secure.decorator.js.map