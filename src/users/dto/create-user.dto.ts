import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
    @ApiProperty({description:'User name', nullable:false})
    name:string

    @ApiProperty({description:'User email', nullable:false})
    email:string

    @ApiProperty({description:'User password', nullable:false})
    password:string

    @ApiProperty({description:'User password', nullable:false})
    roles:string[]
}
