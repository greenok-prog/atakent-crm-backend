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
    @ApiProperty({description:'Exhibitions description', nullable:true})
    description:string

    @Column()
    @ApiProperty({description:'Exhibitions description', nullable:true})
    location:string

    @Column()
    @ApiProperty({description:'Exhibitions website', nullable:true})
    website:string

    @Column()
    @ApiProperty({description:'Exhibition start date', nullable:true})
    dateStart:Date

    @Column()
    @ApiProperty({description:'Exhibition end date', nullable:true})
    dateEnd:Date

    @Column()
    @ApiProperty({description:'Exhibition image', nullable:true})
    image:string

    @Column()
    @ApiProperty({description:'Exhibition ticket bg', nullable:true})
    ticketUrl:string

    @OneToMany(() => Exhibitor, (exhibitor) => exhibitor.exhibitionId)
    exhibitors:Exhibitor[]

    @OneToMany(() => Visitor, (visitor) => visitor.exhibitionId, )
    visitors:Visitor[]



    
}
