import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentTypeDto {
    @ApiProperty({
        description: 'Nombre del tipo de documento',
        example: 'DNI'
    })
    @IsNotEmpty({ message: 'El nombre es requerido' })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    name: string;
} 