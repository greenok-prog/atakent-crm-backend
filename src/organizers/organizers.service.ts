import { Injectable } from '@nestjs/common';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { UpdateOrganizerDto } from './dto/update-organizer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organizer } from './entities/organizer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizersService {
  constructor(
    @InjectRepository(Organizer)
    private OrganizerRepository: Repository<Organizer>

  ){}

  create(createOrganizerDto: CreateOrganizerDto) {
   const organizer = this.OrganizerRepository.create(createOrganizerDto)
   return this.OrganizerRepository.save(organizer)
  }

  findAll() {
    return this.OrganizerRepository.find();
  }

  findOne(id: number) {
    return this.OrganizerRepository.findOne({where:{id}});
  }

  async update(id: number, updateOrganizerDto: UpdateOrganizerDto) {
    await this.OrganizerRepository.update(id, updateOrganizerDto);
    const organizer = await this.OrganizerRepository.findOneBy({id})
    return organizer

  }

  remove(id: number) {
    return this.OrganizerRepository.delete(id)
  }
}
