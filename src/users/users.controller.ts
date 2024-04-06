import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Query,
  Delete,
  Patch,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('users')
@Serialize(UserDto) // nah kita taruh sini nanti akan menjadi global interceptor. Jadi semua return mengacu pada do yang udh kita buat. Kalau mau dto yang berbeda beda ya kita harus buat dto masing2 dan di pasang di route masign2
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseInterceptors(Serialize)
  @Get()
  findAllUsers(@Query('email') email: string) {
    // query untuk menambahkan query di saat kita pada method get
    return this.usersService.find(email);
  }
  // @Get()
  // findAllUsers() {
  //   return this.usersService.findAll();
  // }
  @Post()
  createUser(@Body() body: CreateUserDto) {
    this.usersService.create(body.name, body.email, body.password);
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.usersService.findOneBy(parseInt(id));
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

  @Get('/auth/current-user')
  @UseGuards(AuthGuard)
  currentUser(@CurrentUser() user: User) {
    return user;
  }
}
