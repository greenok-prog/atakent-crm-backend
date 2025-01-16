import { Injectable } from '@nestjs/common';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { Repository } from 'typeorm';
import { Source } from './entities/source.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SourcesService {
  constructor(
    @InjectRepository(Source)
    private SourceRepository: Repository<Source>

  ){}

  create(createSourceDto: CreateSourceDto) {
    const source = this.SourceRepository.create(createSourceDto)
    return source
  }

  findAll() {
    return this.SourceRepository.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} source`;
  }

  update(id: number, updateSourceDto: UpdateSourceDto) {
    return `This action updates a #${id} source`;
  }

  remove(id: number) {
    return `This action removes a #${id} source`;
  }
}
