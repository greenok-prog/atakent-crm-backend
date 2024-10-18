import { ApiProperty } from "@nestjs/swagger";
import { Employee } from "src/employees/entities/employee.entity";
import { Exhibition } from "src/exhibitions/entities/exhibition.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Exhibitor {
    @PrimaryGeneratedColumn()
    @ApiProperty({description:'Exhibitor identifier', nullable:false})
    id:number

    @Column()
    @ApiProperty({description:'Exhibitor company', nullable:true})
    companyName:string

    @Column()
    @ApiProperty({description:'Exhibitor phone', nullable:true})
    companyPhone:string

    @Column()
    @ApiProperty({description:'Exhibitor email', nullable:true})
    email:string

    @Column()
    @ApiProperty({description:'Exhibitor logo', nullable:true})
    logo:string

    @Column()
    @ApiProperty({description:'Exhibitor instagram', nullable:true})
    instagram:string

    @Column()
    @ApiProperty({description:'Exhibitor youtube', nullable:true})
    youtube:string

    @Column()
    @ApiProperty({description:'Exhibitor facebook', nullable:true})
    facebook:string

    @Column()
    @ApiProperty({description:'Exhibitor website', nullable:true})
    website:string

    @Column({name:'exhibition_id'})
    exhibitionId:number

    @OneToMany(() => Employee, (employee) => employee.exhibitor)
    employees:Employee[]

    @ApiProperty({description:'Exhibition', nullable:true})
    @ManyToOne(() => Exhibition, (exhibition) => exhibition.id, {onDelete:'CASCADE', onUpdate:'CASCADE'})
    @JoinColumn({name:'exhibition_id'})
    exhibiton:Exhibition

    constructor(
        id:number, company_name:string, company_phone:string, exhibiton:Exhibition, 
        exhibition_id:number, website:string, email:string, employees:Employee[]
    ){
        this.id = id
        this.companyName = company_name
        this.companyPhone = company_phone
        this.exhibiton = exhibiton
        this.exhibitionId = exhibition_id
        this.website = website
        this.email = email
        this.employees = employees
    }
}
