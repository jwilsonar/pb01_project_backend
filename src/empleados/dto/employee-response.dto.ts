import { ApiProperty } from '@nestjs/swagger';

class CreatedByDto {
    @ApiProperty({
        description: 'ID del usuario de RRHH',
        example: 1
    })
    id: number;

    @ApiProperty({
        description: 'Email del usuario de RRHH',
        example: 'hr@empresa.com'
    })
    email: string;
}

export class EmployeeResponseDto {
    @ApiProperty({
        description: 'ID único del empleado',
        example: 1
    })
    id: number;

    @ApiProperty({
        description: 'Título o puesto del empleado',
        example: 'Desarrollador Senior'
    })
    job_title: string;

    @ApiProperty({
        description: 'Salario del empleado en la moneda base',
        example: 50000
    })
    salary: number;

    @ApiProperty({
        description: 'Nombre del empleado',
        example: 'Juan'
    })
    first_name: string;

    @ApiProperty({
        description: 'Apellido del empleado',
        example: 'Pérez'
    })
    last_name: string;

    @ApiProperty({
        description: 'Email del empleado',
        example: 'juan.perez@empresa.com'
    })
    email: string;

    @ApiProperty({
        description: 'Cantidad de documentos asociados al empleado',
        example: 3,
        minimum: 0
    })
    documents_count: number;

    @ApiProperty({
        description: 'Información del usuario de RRHH que creó el empleado',
        type: CreatedByDto
    })
    created_by: CreatedByDto;
} 