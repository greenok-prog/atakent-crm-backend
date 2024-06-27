import { ApiProperty } from "@nestjs/swagger"
import { VisitorExecutor } from "../entities/visitor.entity"
import { IsEmail, IsNotEmpty } from "class-validator"

export class CreateVisitorDto {
    @IsNotEmpty({message:'Имя должно быть заполнено'})
    @ApiProperty({description:'Visitor name', nullable:true})
    name:string

    @IsNotEmpty({message:'Поле Номер должно быть заполнено'})
    @ApiProperty({description:'Visitor phone', nullable:true})
    phone:string

    
    @IsNotEmpty({message:'Поле Email должно быть заполнено'})
    @IsEmail()
    @ApiProperty({description:'Visitor email', nullable:true})
    email:string

    @IsNotEmpty({message:'Поле должно быть заполнено'})
    @ApiProperty({description:'Visitor fair', nullable:true})
    fair:string

    @IsNotEmpty({message:'Поле должно быть заполнено'})
    @ApiProperty({description:'Visitor executor', nullable:true})
    executor:VisitorExecutor

    @ApiProperty({description:'Visitor country/city', nullable:true})
    country:string

    @ApiProperty({description:'Visitor company name', nullable:true})
    companyName:string

    @IsNotEmpty({message:'Поле должно быть заполнено'})
    @ApiProperty({description:'Visitor country/city', nullable:true})
    exhibition:number

    @ApiProperty({description:'Visitor country/city', nullable:true})
    qrValue:string



}
