import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExhibitorsModule } from './exhibitors/exhibitors.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exhibitor } from './exhibitors/entities/exhibitor.entity';
import { ExhibitionsModule } from './exhibitions/exhibitions.module';
import { Exhibition } from './exhibitions/entities/exhibition.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EmployeesModule } from './employees/employees.module';
import { Employee } from './employees/entities/employee.entity';
import { VisitorsModule } from './visitors/visitors.module';
import { Visitor } from './visitors/entities/visitor.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([ExhibitorsModule, ExhibitionsModule, EmployeesModule, VisitorsModule]),
  ConfigModule.forRoot(),
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'test',
    charset: 'utf8mb4',
    entities: [Exhibitor, Exhibition, Employee, Visitor],
    synchronize: true,
  }), 
  ExhibitionsModule, ExhibitorsModule,
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..'),
  }),
  EmployeesModule,
  VisitorsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
