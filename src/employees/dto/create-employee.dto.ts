import { ApiProperty } from "@nestjs/swagger"

export class CreateEmployeeDto {
    @ApiProperty({description:'Employee name', nullable:true})
    name:string

    @ApiProperty({description:'Employee position', nullable:true})
    position:string
}
