import { Module } from '@nestjs/common';
import { VisitorsService } from './visitors.service';
import { VisitorsController } from './visitors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visitor } from './entities/visitor.entity';
import { Exhibition } from 'src/exhibitions/entities/exhibition.entity';
import { MailerModule } from 'src/mailer/mailer.module';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Visitor, Exhibition]), MailerModule],
  controllers: [VisitorsController],
  providers: [VisitorsService, MailerService],
})
export class VisitorsModule {}
