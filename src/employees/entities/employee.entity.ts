import { ApiProperty } from "@nestjs/swagger"
import { Exhibitor } from "src/exhibitors/entities/exhibitor.entity"
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    @ApiProperty({description:'Employee identifier', nullable:false})
    id:number

    @Column()
    @ApiProperty({description:'Employee name', nullable:true})
    name:string

    @Column({name:'exhibitor_id'})
    exhibitorId:number

    @Column()
    @ApiProperty({description:'Employee position', nullable:true})
    position:string

    @ManyToOne(() => Exhibitor, exhibitor => exhibitor.employees, {
        onDelete:'CASCADE', cascade:true
    })
    @ApiProperty({description:'Employee position', nullable:true})
    exhibitor: Exhibitor

    constructor(id:number, name:string, exhibitorId:number, position:string, exhibitor:Exhibitor){
        this.id = id
        this.name = name
        this.exhibitor = exhibitor
        this.position = position
        this.exhibitorId = exhibitorId
    }



}
