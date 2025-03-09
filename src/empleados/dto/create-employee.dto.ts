import { IsNotEmpty, IsNumber, IsString, Min, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
    @ApiProperty({
        description: 'Título o puesto del empleado',
        example: 'Desarrollador Senior',
        required: true
    })
    @IsNotEmpty({ message: 'El título del puesto es requerido' })
    @IsString({ message: 'El título del puesto debe ser una cadena de texto' })
    job_title: string;

    @ApiProperty({
        description: 'Salario del empleado en la moneda base',
        example: 50000,
        minimum: 0,
        required: true
    })
    @IsNotEmpty({ message: 'El salario es requerido' })
    @IsNumber({}, { message: 'El salario debe ser un número' })
    @Min(0, { message: 'El salario no puede ser negativo' })
    salary: number;

    @ApiProperty({
        description: 'Nombre del empleado',
        example: 'Juan',
        required: true
    })
    @IsNotEmpty({ message: 'El nombre es requerido' })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    first_name: string;

    @ApiProperty({
        description: 'Apellido del empleado',
        example: 'Pérez',
        required: true
    })
    @IsNotEmpty({ message: 'El apellido es requerido' })
    @IsString({ message: 'El apellido debe ser una cadena de texto' })
    last_name: string;

    @ApiProperty({
        description: 'Email del empleado',
        example: 'juan.perez@empresa.com',
        required: true
    })
    @IsNotEmpty({ message: 'El email es requerido' })
    @IsEmail({}, { message: 'El email debe tener un formato válido' })
    email: string;

    @ApiProperty({ 
        description: 'ID del usuario de RRHH que crea el empleado. Este valor se asigna automáticamente del token JWT.',
        example: 1,
        required: false,
        readOnly: true
    })

    @ApiProperty({
        description: 'Contraseña del empleado',
        example: 'password123',
        required: true
    })
    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    password: string;
} 