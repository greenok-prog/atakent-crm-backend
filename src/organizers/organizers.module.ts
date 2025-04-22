import { Module } from '@nestjs/common';
import { OrganizersService } from './organizers.service';
import { OrganizersController } from './organizers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organizer } from './entities/organizer.entity';
import { Exhibition } from 'src/exhibitions/entities/exhibition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organizer, Exhibition]),],
  controllers: [OrganizersController],
  providers: [OrganizersService],
})
export class OrganizersModule {}
