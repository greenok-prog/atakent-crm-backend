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
    return this.SourceRepository.save(source)
  }

  findAll() {
    return this.SourceRepository.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} source`;
  }

  async update(id: number, updateSourceDto: UpdateSourceDto) {
    await this.SourceRepository.update(id, updateSourceDto);
    const source = await this.SourceRepository.findOneBy({id})
    return source

  }

  async remove(id: number) {
    return await this.SourceRepository.delete(id)
  }
}
