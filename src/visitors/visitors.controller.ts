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
  async changeQr(@Query() query, @Res() res: Response) {
    const {id} = query
    const visitorInfo = await this.visitorsService.changeQrValue(id);
    // const pdfBuffer = await this.visitorsService.createPdf(visitorInfo.name);
    
    // // Устанавливаем заголовки для загрузки файла
    // res.setHeader('Content-Disposition', 'attachment; filename="example.pdf"');
    // res.setHeader('Content-Type', 'application/pdf');
    
    // // Отправляем PDF файл
    // res.send(pdfBuffer);
    return visitorInfo
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
