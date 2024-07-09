import { Injectable } from '@nestjs/common';
import { CreateExhibitionDto } from './dto/create-exhibition.dto';
import { UpdateExhibitionDto } from './dto/update-exhibition.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Exhibition } from './entities/exhibition.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExhibitionsService {
  constructor(
    @InjectRepository(Exhibition)
    private ExhibitionRepository: Repository<Exhibition>

  ){}

  async create(dto: CreateExhibitionDto) {
    
    let newExhibition = this.ExhibitionRepository.create(dto)
    return await this.ExhibitionRepository.save(newExhibition)
   
  }

  findAll() {
    return this.ExhibitionRepository.find({
      
    })
  }

  async findOne(id: number) {
    return await this.ExhibitionRepository.findBy({id})
  }

  async update(id: number, updateExhibitionDto: UpdateExhibitionDto) {
    await this.ExhibitionRepository.update(id,updateExhibitionDto )
  }

  async remove(id: number) {
    return await this.ExhibitionRepository.delete(id)
  }
}
