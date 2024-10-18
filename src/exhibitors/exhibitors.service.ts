import { Injectable, Query } from '@nestjs/common';
import { CreateExhibitorDto } from './dto/create-exhibitor.dto';
import { UpdateExhibitorDto } from './dto/update-exhibitor.dto';
import { Exhibitor } from './entities/exhibitor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from 'src/employees/entities/employee.entity';

@Injectable()
export class ExhibitorsService {
  constructor(
    @InjectRepository(Exhibitor)
    private readonly ExhibitorRepository: Repository<Exhibitor>,
    @InjectRepository(Employee)
    private EmployeeRepository: Repository<Employee>,
) {}
  async create(dto: CreateExhibitorDto) {
    const parsedEmployees = JSON.parse(dto.employees)
    const employees = []
    for(const el of parsedEmployees){
      employees.push(el)
      let employee = this.EmployeeRepository.create({name:el.name, position:el.position})
      await this.EmployeeRepository.save(employee)
    }
    let exhibitor = this.ExhibitorRepository.create({...dto, employees})
    return await this.ExhibitorRepository.save(exhibitor)
   
  }

  findAll(@Query() query): Promise<Exhibitor[]> {
    return this.ExhibitorRepository.find({
      where:{
        companyName: query.search
      },
      relations:{
        exhibiton:true
      }
    })
  }

  findOne(id: number):Promise<Exhibitor> {
    return this.ExhibitorRepository.findOneBy({id})
  }

  update(id: number, updateExhibitorDto: UpdateExhibitorDto) {
    return `This action updates a #${id} exhibitor`;
  }

  remove(id: number) {
    return this.ExhibitorRepository.delete(id)
  }
}
