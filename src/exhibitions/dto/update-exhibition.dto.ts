import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateExhibitionDto } from './create-exhibition.dto';
import { IsNotEmpty } from 'class-validator';
import { Column } from 'typeorm';
import { Organizer } from 'src/organizers/entities/organizer.entity';

export class UpdateExhibitionDto extends PartialType(CreateExhibitionDto) {
    
    @IsNotEmpty({ message: 'Имя должно быть заполнено' })
  @ApiProperty({ description: 'Exhibition name', nullable: false })
  name: string;

  @IsNotEmpty({ message: 'Описание должно быть заполнено' })
  @ApiProperty({ description: 'Exhibitions description', nullable: false })
  description: string;

  @IsNotEmpty({ message: 'Местоположение должно быть заполнено' })
  @ApiProperty({ description: 'Exhibitions location', nullable: false })
  location: string;

  @IsNotEmpty({ message: 'Веб-сайт должен быть заполнен' })
  @ApiProperty({ description: 'Exhibitions website', nullable: true })
  website: string;

  @IsNotEmpty({ message: 'Дата начала должна быть заполнена' })
  @ApiProperty({ description: 'Exhibition start date', nullable: false })
  dateStart: Date;

  @IsNotEmpty({ message: 'Дата окончания должна быть заполнена' })
  @ApiProperty({ description: 'Exhibition end date', nullable: false })
  dateEnd: Date;

  @ApiProperty({ description: 'Exhibition image', nullable: true })
  image: string;

  @ApiProperty({ description: 'Exhibition ticket bg', nullable: true })
  ticketUrl: string;

  @IsNotEmpty({ message: 'Организатора необходимо добавить' })
  organizer: Organizer;
  

  
}
