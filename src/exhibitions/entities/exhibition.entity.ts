import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Exhibitor } from "src/exhibitors/entities/exhibitor.entity";
import { Visitor } from "src/visitors/entities/visitor.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Exhibition {
    @PrimaryGeneratedColumn()
    @ApiProperty({description:'Exhibition identifier', nullable:false})
    id:number

    @IsNotEmpty({message:'Имя должно быть заполнено'})
    @Column()
    @ApiProperty({description:'Exhibition name', nullable:true})
    name:string

    @Column()
    @ApiProperty({description:'Exhibition ticket bg', nullable:true})
    ticketUrl:string

    @OneToMany(() => Exhibitor, (exhibitor) => exhibitor.exhibitionId)
    exhibitors:Exhibitor[]

    @OneToMany(() => Visitor, (visitor) => visitor.exhibitionId, )
    visitors:Visitor[]



    
}
