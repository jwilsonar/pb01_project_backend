import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class UploadDocumentDto {
    @ApiProperty({
        type: 'number',
        description: 'ID del tipo de documento',
        example: 1
    })
    @IsNumber()
    @Transform(({ value }) => Number(value))
    document_type_id: number;

    @IsNumber()
    @Transform(({ value }) => Number(value))
    employee_id: number;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Archivo a subir (PDF, DOC, DOCX, etc.)'
    })
    file: any;
} 