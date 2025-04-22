import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus, Query } from '@nestjs/common';
import { ExhibitionsService } from './exhibitions.service';
import { CreateExhibitionDto } from './dto/create-exhibition.dto';
import { UpdateExhibitionDto } from './dto/update-exhibition.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiTags('Exhibitions')
@Controller('exhibitions')
export class ExhibitionsController {
  constructor(private readonly exhibitionsService: ExhibitionsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage:diskStorage({
      destination:'public/exhibitions',
      filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
      },
    })
  }))
  async create(@Body() createExhibitionDto: CreateExhibitionDto, @UploadedFile(
    
  ) image:Express.Multer.File) {
      const exhibition = await this.exhibitionsService.create({...createExhibitionDto, image:image.path});
      return exhibition
  }

  @Get()
  async findAll(@Query() query) {
    return await this.exhibitionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exhibitionsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: 'public/exhibitions',
      filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
      },
    }),
  }))
  async update(
    @Param('id') id: string,
    @Body() updateExhibitionDto: UpdateExhibitionDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      return this.exhibitionsService.update(+id, { ...updateExhibitionDto, image: file.path });
    } else {
      return this.exhibitionsService.update(+id, updateExhibitionDto);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exhibitionsService.remove(+id);
  }
}
