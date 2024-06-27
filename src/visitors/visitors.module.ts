import { Module } from '@nestjs/common';
import { VisitorsService } from './visitors.service';
import { VisitorsController } from './visitors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visitor } from './entities/visitor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Visitor])],
  controllers: [VisitorsController],
  providers: [VisitorsService],
})
export class VisitorsModule {}
