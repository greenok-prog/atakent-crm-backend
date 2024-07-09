import { ApiProperty } from "@nestjs/swagger";
import { Column } from "typeorm";

export class CreateExhibitionDto {
    @ApiProperty({description:'Exhibition name', nullable:true})
    name:string

    ticketUrl:any
}
