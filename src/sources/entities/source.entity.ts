import { ApiProperty } from "@nestjs/swagger"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Source {
    @PrimaryGeneratedColumn()
    @ApiProperty({description:'Source identifier', nullable:false})
    id:number

    @Column()
    @ApiProperty({description:'Source name', nullable:true})
    name:string
}
