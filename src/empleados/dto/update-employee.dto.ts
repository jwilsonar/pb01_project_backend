import { IsOptional, IsNumber, IsString, Min, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmployeeDto {
    @ApiProperty({
        description: 'Título o puesto del empleado',
        example: 'Desarrollador Senior',
        required: false
    })
    @IsOptional()
    @IsString({ message: 'El título del puesto debe ser una cadena de texto' })
    job_title?: string;

    @ApiProperty({
        description: 'Salario del empleado en la moneda base',
        example: 50000,
        minimum: 0,
        required: false
    })
    @IsOptional()
    @IsNumber({}, { message: 'El salario debe ser un número' })
    @Min(0, { message: 'El salario no puede ser negativo' })
    salary?: number;

    @ApiProperty({
        description: 'Nombre del empleado',
        example: 'Juan',
        required: false
    })
    @IsOptional()
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    first_name?: string;

    @ApiProperty({
        description: 'Apellido del empleado',
        example: 'Pérez',
        required: false
    })
    @IsOptional()
    @IsString({ message: 'El apellido debe ser una cadena de texto' })
    last_name?: string;

    @ApiProperty({
        description: 'Email del empleado',
        example: 'juan.perez@empresa.com',
        required: false
    })
    @IsOptional()
    @IsEmail({}, { message: 'El email debe tener un formato válido' })
    email?: string;

    @ApiProperty({
        description: 'Contraseña del empleado',
        example: 'newpassword123',
        required: false
    })
    @IsOptional()
    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    password?: string;
} 