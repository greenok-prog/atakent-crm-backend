import { Injectable } from '@nestjs/common';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Source } from './entities/source.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SourcesService {
  @InjectRepository(Source)
  private readonly SourceRepository: Repository<Source>

  async create(createSourceDto: CreateSourceDto) {
    const source = this.SourceRepository.create(createSourceDto)
    return await this.SourceRepository.save(source)
  }

  findAll(sourceId?:number) {
    return this.SourceRepository.find({
     where: {
      id:sourceId
     }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} source`;
  }

  update(id: number, updateSourceDto: UpdateSourceDto) {
    return `This action updates a #${id} source`;
  }

  remove(id: number) {
    return this.SourceRepository.delete(id)
  }
}
