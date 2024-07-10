import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    return this.usersRepository.save(user);
  }
  async findAll(): Promise<User[]>{
    return this.usersRepository.find({
      select:['id', 'email', 'name', 'roles']
    })
  }
  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({email})
  }

  async findById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOneBy({id});
  }

  async remove(id:number){
    return this.usersRepository.delete(+id)
  }
}
