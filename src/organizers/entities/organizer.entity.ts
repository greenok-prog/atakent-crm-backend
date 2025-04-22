import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Exhibition } from 'src/exhibitions/entities/exhibition.entity';


@Entity()
export class Organizer {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'Organizer identifier', nullable: false })
    id: number;

    @IsNotEmpty({ message: 'Имя должно быть заполнено' })
    @Column()
    @ApiProperty({ description: 'Organizer name', nullable: true })
    name: string;

    @OneToMany(() => Exhibition, (exhibition) => exhibition.organizer)
    exhibitions: Exhibition[];

    @ApiProperty({ description: 'is Main', nullable: true, default:false })
    @Column({ default: false, nullable:true }, )
    isMain: boolean
}

