import { ValidationPipe } from '@nestjs/common';
import cookieSession = require('cookie-session');

export const setupApp = (app: any) => {
  app.use(cookieSession({ keys: ['randomstring'] }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
};

// intine file ini dibuat agar kita bisa memanggilnya di file lain seperti spec.ts untuk penggunaan cookies
// memisahkan pipe dan middleware dalam file berbeda
