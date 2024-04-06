import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util'; //mengubah yg returnya callback menjadi asyn await

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(name: string, email: string, password: string) {
    //check apakah ada user yang mengggunakan email yg sama
    const users = await this.usersService.find(email); //memastikan kita menemukan datanya terlebih dahulu
    if (users.length) {
      throw new BadRequestException('email sudah terdaftar');
    }
    //hash pasword
    const salt = randomBytes(8).toString('hex'); //nah karena kita mengguankan hex maka total per byte itu 2 string jadi total akhir ada 16 bytes
    const hash = (await scrypt(password, salt, 64)) as Buffer; // kenapa buffer karena men generate jg cukup lama mnaka kita perlu gunakan buffer //semakin besar nilainya semakin besar
    const hashedPassword = salt + '.' + hash.toString('hex');

    //create user
    const user = await this.usersService.create(name, email, hashedPassword);

    return user;
  }

  async login(email: string, password: string) {
    const [user] = await this.usersService.find(email); // mengapap pake kurung karena nanti hasilnya adalah array tapi kita ingin haslinya tuh sebuah object
    if (!user) {
      throw new NotFoundException('Email tidak terdaftar');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 64)) as Buffer;

    if (storedHash != hash.toString('hex')) {
      throw new BadRequestException('wrong password');
    }

    return user;
  }
}
