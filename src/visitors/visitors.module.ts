import { Module } from '@nestjs/common';
import { VisitorsService } from './visitors.service';
import { VisitorsController } from './visitors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visitor } from './entities/visitor.entity';
import { Exhibition } from 'src/exhibitions/entities/exhibition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Visitor, Exhibition])],
  controllers: [VisitorsController],
  providers: [VisitorsService],
})
export class VisitorsModule {}
