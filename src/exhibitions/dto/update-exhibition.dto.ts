import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateExhibitionDto } from './create-exhibition.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateExhibitionDto extends PartialType(CreateExhibitionDto) {
    
    @IsNotEmpty({message:'Имя должно быть заполнено'})
    @ApiProperty({description:'Exhibition name', nullable:true})
    name:string
}
