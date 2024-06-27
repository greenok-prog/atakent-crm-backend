import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"
import { Employee } from "src/employees/entities/employee.entity"
import { Exhibition } from "src/exhibitions/entities/exhibition.entity"

export class CreateExhibitorDto {
    @IsNotEmpty({message:'Название компании обязательное поле'})
    @ApiProperty({description:'Exhibitor company', nullable:true})
    companyName:string

    @IsNotEmpty()
    @ApiProperty({description:'Exhibitor phone', nullable:true})
    companyPhone:string

    @ApiProperty({description:'Exhibition', nullable:true})
    exhibitonId:number

    @ApiProperty({description:'Exhibition', nullable:true})
    employees:string

    @ApiProperty({description:'Exhibition', nullable:true})
    logo:string
 
    @ApiProperty({description:'Exhibitor email', nullable:true})
    email:string

    @ApiProperty({description:'Exhibitor website', nullable:true})
    website:string
}
