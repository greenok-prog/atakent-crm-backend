import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExhibitionsService } from './exhibitions.service';
import { CreateExhibitionDto } from './dto/create-exhibition.dto';
import { UpdateExhibitionDto } from './dto/update-exhibition.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Exhibitions')
@Controller('exhibitions')
export class ExhibitionsController {
  constructor(private readonly exhibitionsService: ExhibitionsService) {}

  @Post()
  create(@Body() createExhibitionDto: CreateExhibitionDto) {
    return this.exhibitionsService.create(createExhibitionDto);
  }

  @Get()
  findAll() {
    return this.exhibitionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exhibitionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExhibitionDto: UpdateExhibitionDto) {
    return this.exhibitionsService.update(+id, updateExhibitionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exhibitionsService.remove(+id);
  }
}
