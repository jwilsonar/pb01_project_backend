import { ApiProperty } from '@nestjs/swagger';

export class DocumentResponseDto {
    @ApiProperty({
        type: 'number',
        description: 'ID del documento',
        example: 1
    })
    id: number;

    @ApiProperty({
        type: 'number',
        description: 'ID del tipo de documento',
        example: 1
    })
    document_type_id: number;

    @ApiProperty({
        type: 'number',
        description: 'ID del empleado',
        example: 1
    })
    employee_id: number;

    @ApiProperty({
        type: 'string',
        description: 'URL del archivo en S3',
        example: 'https://mi-bucket.s3.amazonaws.com/documents/1/1234567890-curriculum.pdf'
    })
    file_path: string;

    @ApiProperty({
        type: 'boolean',
        description: 'Indica si el documento está activo',
        example: true
    })
    is_active: boolean;
}

export class DeleteDocumentResponseDto {
    @ApiProperty({
        type: 'string',
        description: 'Mensaje de confirmación',
        example: 'Documento eliminado correctamente'
    })
    message: string;
} 