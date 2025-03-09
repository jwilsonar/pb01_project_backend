import { ApiProperty } from '@nestjs/swagger';

class EmployeeDocumentDto {
    @ApiProperty({
        description: 'ID del documento',
        example: 1
    })
    id: number;

    @ApiProperty({
        description: 'Nombre del documento',
        example: 'Contrato.pdf'
    })
    document_name: string;

    @ApiProperty({
        description: 'URL del documento',
        example: 'https://storage.com/documents/contrato.pdf'
    })
    document_url: string;

    @ApiProperty({
        description: 'Tipo de documento',
        example: 'Contrato'
    })
    document_type: {
        id: number;
        type_name: string;
    };
}

class EmployeeDetailsDto {
    @ApiProperty({
        description: 'ID del empleado',
        example: 1
    })
    id: number;

    @ApiProperty({
        description: 'Título o puesto del empleado',
        example: 'Desarrollador Senior'
    })
    job_title: string;

    @ApiProperty({
        description: 'Salario del empleado',
        example: 50000
    })
    salary: number;

    @ApiProperty({
        description: 'Documentos del empleado',
        type: [EmployeeDocumentDto]
    })
    documents: EmployeeDocumentDto[];
}

export class ProfileResponseDto {
    @ApiProperty({
        description: 'ID del usuario',
        example: 1
    })
    id: number;

    @ApiProperty({
        description: 'Email del usuario',
        example: 'usuario@empresa.com'
    })
    email: string;

    @ApiProperty({
        description: 'Nombre del usuario',
        example: 'Juan'
    })
    first_name: string;

    @ApiProperty({
        description: 'Apellido del usuario',
        example: 'Pérez'
    })
    last_name: string;

    @ApiProperty({
        description: 'Indica si el usuario es de RRHH',
        example: false
    })
    is_hr: boolean;

    @ApiProperty({
        description: 'Detalles del empleado si el usuario está asociado a uno',
        type: EmployeeDetailsDto,
        required: false
    })
    employee?: EmployeeDetailsDto;
} 