import { Injectable } from '@nestjs/common';
import { CreateExhibitionDto } from './dto/create-exhibition.dto';
import { UpdateExhibitionDto } from './dto/update-exhibition.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Exhibition } from './entities/exhibition.entity';
import { Repository } from 'typeorm';
import { Organizer } from 'src/organizers/entities/organizer.entity';

@Injectable()
export class ExhibitionsService {
  constructor(
    @InjectRepository(Exhibition)
    private ExhibitionRepository: Repository<Exhibition>,
  ){}

  async create(dto: CreateExhibitionDto) {
    let newExhibition = this.ExhibitionRepository.create(dto)
    return await this.ExhibitionRepository.save(newExhibition)
   
  }

  async findAll(query) {
    const { main } = query;

    const queryOptions: any = {
        relations: {
            organizer: true, // Подгружаем связанную сущность Organizer
        },
    };

    if (main !== undefined) {
        queryOptions.where = {
            organizer: {
                isMain: main === 'true' ? true : false, // Преобразуем строку в булево значение
            },
        };
    }

    const exhibitions = await this.ExhibitionRepository.find(queryOptions);
    return exhibitions;
}

  async findOne(id: number) {
    return await this.ExhibitionRepository.findBy({id})
  }

  async update(id: number, updateExhibitionDto: UpdateExhibitionDto) {
    // Обновляем данные
    await this.ExhibitionRepository.update(id, updateExhibitionDto);
  
    // Находим и возвращаем обновленный объект
    return this.ExhibitionRepository.findOneBy({id}, );
  }
  

  async remove(id: number) {
    return await this.ExhibitionRepository.delete(id)
  }
}
