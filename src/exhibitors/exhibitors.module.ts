import { Module } from '@nestjs/common';
import { ExhibitorsService } from './exhibitors.service';
import { ExhibitorsController } from './exhibitors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exhibitor } from './entities/exhibitor.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Exhibitor, Employee]),  JwtModule.register({
    secret: `${process.env.SECRET_ACCESS}`, // замените на ваш секретный ключ JWT
    signOptions: { expiresIn: '7d' }, // настройки подписи JWT токена
  }),],
  controllers: [ExhibitorsController],
  providers: [ExhibitorsService, ],
})
export class ExhibitorsModule {}
