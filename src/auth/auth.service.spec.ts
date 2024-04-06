import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>; // kita panggil di sini supaya nanti method findnya bisa flexible

  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      find: (email: string) => {
        const user = users.filter((user) => user.email === email);
        return Promise.resolve(user);
      },

      create: (name: string, email: string, password: string) => {
        const user = {
          // pake ini biar dinamis tidak harus membuat yang sama diulang untuk data dumy
          id: Math.floor(Math.random() * 99999),
          name,
          email,
          password,
        } as User;

        users.push(user); // kita push ke var user di atas
        return Promise.resolve(user); // ini nilai kembalian dari di ats
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    // ini adalaha proses apa yang akan kita uji
    expect(service).toBeDefined();
  });

  it('should be create a new user', async () => {
    const user = await service.register(
      'Pangop',
      'pangop@email.com',
      'password',
    );

    expect(user.password).not.toEqual('password');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should fail to create a user with an existing email', async () => {
    await service.register('Pangop', 'pangop@email.com', 'password');
    await expect(
      service.register('Pangop', 'pangop@email.com', 'password'),
    ).rejects.toThrow('email sudah terdaftar'); // ini pesannya harus sama seperti di auth service
  });

  it('throws if user login with invalid email', async () => {
    await expect(service.login('admin@email.com', 'password')).rejects.toThrow(
      'Email tidak terdaftar',
    );
  });

  it('should fail if user login with invalid password', async () => {
    await service.register('Pangop', 'pangop@email.com', 'test123');
    await expect(service.login('pangop@email.com', 'password')).rejects.toThrow(
      'wrong password',
    );
  });

  it('should login existing user', async () => {
    await service.register('Pangop', 'pangop@email.com', 'password'); // ini merupakah result dari mock data kita sehingga lebih simple dan rapi
    const user = await service.login('pangop@email.com', 'password');
    expect(user).toBeDefined();
  });
});
