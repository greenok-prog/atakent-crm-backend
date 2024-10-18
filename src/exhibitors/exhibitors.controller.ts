import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus, Query } from '@nestjs/common';
import { ExhibitorsService } from './exhibitors.service';
import { CreateExhibitorDto } from './dto/create-exhibitor.dto';
import { UpdateExhibitorDto } from './dto/update-exhibitor.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { EmployeesService } from 'src/employees/employees.service';
import { Exhibitor } from './entities/exhibitor.entity';

const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 2 * 1024 * 1024;


@ApiTags('Exhibitors')
@Controller('exhibitors')
export class ExhibitorsController {
  constructor(private readonly exhibitorsService: ExhibitorsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('logo', {
    storage:diskStorage({
      destination:'public/img',
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    })
  }))
  async create(@UploadedFile(
    new ParseFilePipeBuilder()
    .addMaxSizeValidator({maxSize:MAX_PROFILE_PICTURE_SIZE_IN_BYTES})
    .addFileTypeValidator({fileType: '.(png|jpeg|jpg|svg|webp)' })
    .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })
  ) file:Express.Multer.File,@Body() createExhibitorDto: CreateExhibitorDto) {
    return await this.exhibitorsService.create({...createExhibitorDto, logo:file.path});
  }


  @Get()
  findAll(@Query() query):Promise<Exhibitor[]>{
    
    return this.exhibitorsService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exhibitorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExhibitorDto: UpdateExhibitorDto) {
    return this.exhibitorsService.update(+id, updateExhibitorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exhibitorsService.remove(+id);
  }
}
