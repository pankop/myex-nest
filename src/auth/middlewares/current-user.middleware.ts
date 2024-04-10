import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/user.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User; //misalkan ada data currentUser ini merujuk pada user
    }
  }
}

@Injectable() // ini agar bisa saling menggunakan class di luar
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private userService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {}; // ini klau tdk ada req session maka kosong saja

    if (userId) {
      const user = await this.userService.findOneBy(userId);
      req.currentUser = user; //maka nilai currentUser itu akan bernilai nilai user yg ketemu
    }

    next();
  }
}
