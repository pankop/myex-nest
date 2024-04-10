import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Item } from './items/item.entity';
import { AuthModule } from './auth/auth.module';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
import cookieSession = require('cookie-session');

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   envFilePath: `.env.${process.env.NODE_ENV}`, // akan kita tentukan file .env yang kita definisikan di file pacak.json
    // }),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'sqlite',
    //     database: configService.get<string>('DB_NAME'), // mencari const string dgn nama db name untk mendapatkan value dari file env
    //     entities: [User, Item],
    //     synchronize: true,
    //   }),
    // }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Item],
      synchronize: true,
    }),
    UsersModule,
    ItemsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_PIPE',
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({ keys: ['randomstring'] })).forRoutes('*'); // ini menentukan route akan dapat dimanfaatkan dalam semua route '*'
  }
}

//app module ini kasta tertinggi module jadi semua itu disetting disini kalau mau digunakan secara global.
