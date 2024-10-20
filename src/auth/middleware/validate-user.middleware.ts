import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class ValidateUserMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}
  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      const bearerToken = req.headers.authorization;
      const token = bearerToken.split(' ')[1];
      this.authService
        .validateUser(token)
        .then((user) => {
          (req as any).user = user;
        })
        .catch((err) => {
          console.log(err);
        });
    }
    next();
  }
}
