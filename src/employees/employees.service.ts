import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private EmployeeRepository: Repository<Employee>

  ){}
  async create(dto: CreateEmployeeDto) {
    let newEmployee = this.EmployeeRepository.create(dto)
    newEmployee = await this.EmployeeRepository.save(newEmployee)
    return newEmployee
  }

  findAll() {
    return this.EmployeeRepository.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
