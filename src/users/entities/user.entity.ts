import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @ApiProperty({description:'User identifier', nullable:false})
    id:number

    @Column()
    @ApiProperty({description:'User name', nullable:false})
    name:string

    @Column()
    @ApiProperty({description:'User email', nullable:false})
    email:string

    @Column()
    @ApiProperty({description:'User password', nullable:false})
    password:string

    @Column("simple-array")
    @ApiProperty({description:'User roles', nullable:false})
    roles:string[]
}
