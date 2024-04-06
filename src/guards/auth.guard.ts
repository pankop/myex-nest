import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    return req.session.userId;
  }
}
// konsepnya sama seperti interceptor bisa diimplement global atau beberapa modul saja