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
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([ExhibitorsModule, ExhibitionsModule, EmployeesModule, VisitorsModule, UsersModule, AuthModule, JwtModule]),
  ConfigModule.forRoot(),
  // TypeOrmModule.forRoot({
  //   type: 'mysql',
  //   host: 'vh356.timeweb.ru',
  //   port: 3306,
  //   username: 'atakent_crm',
  //   password: 'Bravo_314',
  //   database: 'atakent_crm',
  //   charset: 'utf8mb4',
  //   entities: [Exhibitor, Exhibition, Employee, Visitor, User],
  //   // synchronize:true
    
  // }), 
  TypeOrmModule.forRoot({
    type: 'sqlite',
      database: 'database.sqlite', // Укажите имя вашей базы данных
      entities: [Exhibitor, Exhibition, Employee, Visitor, User],
      synchronize: true, 
  }),
  ExhibitionsModule, ExhibitorsModule,
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..'),
  }),
  EmployeesModule,
  VisitorsModule,
  UsersModule,
  AuthModule,
  JwtModule],
  controllers: [AppController],
  providers: [AppService, JwtAuthGuard, JwtService],
  
})
export class AppModule {}
