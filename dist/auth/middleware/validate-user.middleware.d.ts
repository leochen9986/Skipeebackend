import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';
import { AuthService } from '../auth.service';
export declare class ValidateUserMiddleware implements NestMiddleware {
    private authService;
    constructor(authService: AuthService);
    use(req: Request, res: Response, next: NextFunction): void;
}
