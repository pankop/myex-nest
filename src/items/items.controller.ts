import {
  Body,
  Controller,
  Param,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateItemDto } from './dtos/create-item.dto';
import { ItemsService } from './items.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ItemDto } from './dtos/item.dto';
import { ApproveItemDto } from './dtos/approve-item.dot';
import { AdminGuard } from '../guards/admin.guard';
import { QueryItemDto } from '../users/dtos/query-item.dto';

@Controller('items')
export class ItemsController {
  constructor(private itemService: ItemsService) {}

  @Get()
  getAllItems(@Query() query: QueryItemDto) {
    return this.itemService.getAllItems(query);
  }
  @Post()
  @UseGuards(AuthGuard) //harus dalam keaddaan autentikasi atau login
  @Serialize(ItemDto) // nanti method create item ini menerapkan serialize dari item dto
  createItem(@Body() body: CreateItemDto, @CurrentUser() user: User) {
    return this.itemService.create(body, user);
  }

  @Patch('/:id') // ini jadi parameter
  @UseGuards(AdminGuard)
  approveItem(@Param('id') id: string, @Body() body: ApproveItemDto) {
    return this.itemService.approvedItem(parseInt(id), body.approved); // nah bagian body jg harus kita spesifikan baggian aprroved sesuai dengan dto yang udh kita buat // kita perlu mengubahnya menjadi integer karena data yang kita terima itu berupa string
  } // kenapa kita pake body karena kita juga akan mendapatkan data approve dari maka kita jg perlu dtonya
}
