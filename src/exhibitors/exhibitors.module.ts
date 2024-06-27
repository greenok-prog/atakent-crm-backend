import { Module } from '@nestjs/common';
import { ExhibitorsService } from './exhibitors.service';
import { ExhibitorsController } from './exhibitors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exhibitor } from './entities/exhibitor.entity';
import { Employee } from 'src/employees/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exhibitor, Employee])],
  controllers: [ExhibitorsController],
  providers: [ExhibitorsService],
})
export class ExhibitorsModule {}
