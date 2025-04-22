import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty } from "class-validator"
import { Exhibition } from "src/exhibitions/entities/exhibition.entity"
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

export type VisitorExecutor = 'individual' | 'company'

@Entity()
export class Visitor {

    @PrimaryGeneratedColumn()
    @ApiProperty({description:'Visitor identifier', nullable:false})
    id:number

    @IsNotEmpty({message:'Имя должно быть заполнено'})
    @Column()
    @ApiProperty({description:'Visitor name', nullable:true})
    name:string

    @IsNotEmpty({message:'Поле Номер должно быть заполнено'})
    @Column()
    @ApiProperty({description:'Visitor phone', nullable:true})
    phone:string

    @IsNotEmpty({message:'Поле Email должно быть заполнено'})
    @IsEmail()
    @Column()
    @ApiProperty({description:'Visitor email', nullable:true})
    email:string

    @IsNotEmpty({message:'Поле должно быть заполнено'})
    @Column()
    @ApiProperty({description:'Visitor fair', nullable:true})
    fair:string

    @Column()
    @ApiProperty({description:'Visitor registration date', nullable:true})
    date:Date

    @IsNotEmpty({message:'Поле должно быть заполнено'})
    @Column()
    @ApiProperty({description:'Visitor executor', nullable:true})
    executor:VisitorExecutor

    @Column()
    @ApiProperty({description:'Visitor country/city', nullable:true})
    country:string

    @Column()
    @ApiProperty({description:'Visitor company name', nullable:true})
    companyName:string

    @Column()
    @ApiProperty({description:'Visitor qr', nullable:true})
    qrValue:string

    @Column({nullable:true})
    @ApiProperty({description:'Visitor qr value', nullable:true})
    qr:boolean

    @Column({ type: 'uuid', nullable: false, unique: true })
    uuid: string; 

    @Column({name:'exhibition_id', nullable:true})
    exhibitionId:number

    @ApiProperty({description:'Exhibition', nullable:true})
    @ManyToOne(() => Exhibition, (exhibition) => exhibition.visitors, {onDelete:'SET NULL', onUpdate:'CASCADE'})
    @JoinColumn({name:'exhibition_id'})
    exhibition:Exhibition





}
