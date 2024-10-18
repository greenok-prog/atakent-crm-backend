import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { VisitorsService } from './visitors.service';
import { Response } from 'express';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { ApiTags } from '@nestjs/swagger';
import { join } from 'path';

@ApiTags('Visitors')
@Controller('visitors')
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @Post()
  create(@Body() createVisitorDto: CreateVisitorDto) {
  
    return this.visitorsService.create(createVisitorDto);
  }

  @Get()
  findAll(@Query() query) {
    return this.visitorsService.findAll(query);
  }
  @Get("/change")
  changeQr(@Query() query) {
    const {id} = query
    return this.visitorsService.changeQrValue(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.visitorsService.findOne(+id);
    

  }
  @Get(':id/ticket')
  async downloadFile(@Param('id') id: string, @Res() response: Response) {
    const file = await this.visitorsService.downloadTicket(+id);
    response.download(file)

  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVisitorDto: UpdateVisitorDto) {
    return this.visitorsService.update(+id, updateVisitorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitorsService.remove(+id);
  }
}
