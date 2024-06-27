import { Module } from '@nestjs/common';
import { ExhibitionsService } from './exhibitions.service';
import { ExhibitionsController } from './exhibitions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exhibition } from './entities/exhibition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exhibition])],
  controllers: [ExhibitionsController],
  providers: [ExhibitionsService],
})
export class ExhibitionsModule {}
