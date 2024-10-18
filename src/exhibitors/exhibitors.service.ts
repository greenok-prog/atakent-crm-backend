import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { CreateExhibitorDto } from './dto/create-exhibitor.dto';
import { UpdateExhibitorDto } from './dto/update-exhibitor.dto';
import { Exhibitor } from './entities/exhibitor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from 'src/employees/entities/employee.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ExhibitorsService {
  constructor(
    @InjectRepository(Exhibitor)
    private readonly ExhibitorRepository: Repository<Exhibitor>,
    @InjectRepository(Employee)
    private EmployeeRepository: Repository<Employee>,
    private readonly jwtService: JwtService,
   
   
    private readonly mailService: MailerService
) {}
  async create(dto: CreateExhibitorDto) {
    const parsedEmployees = JSON.parse(dto.employees)
    const employees = []
    for(const el of parsedEmployees){
      employees.push(el)
      let employee = this.EmployeeRepository.create({name:el.name, position:el.position})
      await this.EmployeeRepository.save(employee)
    }
    let exhibitor = this.ExhibitorRepository.create({...dto, employees, verified:false})
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
  async verifyEmail(token:string){
    if(!token){
      throw new HttpException('token not providet', HttpStatus.UNAUTHORIZED)
    }
    const decodedToken = this.jwtService.verify(token, {
      secret:process.env.SECRET_ACCESS,
    })
    
    if(decodedToken){
      const exhibitor = await this.ExhibitorRepository.findOneBy({email:decodedToken.email})
      exhibitor.verified = true
      return {message:'Email успешно подтвержден'}
      
    }
    throw new HttpException('Email verify error', HttpStatus.NOT_FOUND)
    
  }
  sendConfirmEmail(email:string) {
    const payload = {email}
    const token = this.jwtService.sign(payload, {
      secret:process.env.SECRET_ACCESS,
      
    })
    const message = `Для подтверждения email и входа в личный кабинет перейдите по ссылке: ${process.env.CLIENT_URL}/exhibitor/confirm?token=${token}`;

    this.mailService.sendMail({
      from: 'Artem Frizen <artem@atakentexpo.kz>',
      to: email,
      subject: `How to Send Emails with Nodemailer`,
      text: message,
    });
  }
  findOne(id: number):Promise<Exhibitor> {
    this.sendConfirmEmail('frizen.artem.n@gmail.com')
    return this.ExhibitorRepository.findOneBy({id})
  }

  update(id: number, updateExhibitorDto: UpdateExhibitorDto) {
    return `This action updates a #${id} exhibitor`;
  }

  remove(id: number) {
    return this.ExhibitorRepository.delete(id)
  }
}
