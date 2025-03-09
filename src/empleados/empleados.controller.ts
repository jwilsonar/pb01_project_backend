import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete, 
    UseGuards, 
    Request, 
    HttpStatus, 
    HttpCode,
    ParseIntPipe,
    ForbiddenException
} from '@nestjs/common';
import { 
    ApiTags, 
    ApiOperation, 
    ApiBearerAuth, 
    ApiParam,
    ApiResponse,
    ApiBody,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse
} from '@nestjs/swagger';
import { EmpleadosService } from './empleados.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeResponseDto } from './dto/employee-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HrRoleGuard } from '../common/guards/hr-role.guard';
import { RequireHrRole } from '../common/decorators/hr-role.decorator';
import { ApiCustomResponse } from '../common/decorators/api-response.decorator';

interface JwtUser {
    id: number;
    email: string;
    is_hr: boolean;
}

@ApiTags('Empleados')
@ApiBearerAuth()
@Controller('api/empleados')
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({ description: 'No autorizado - Token JWT inválido o expirado' })
export class EmpleadosController {
    constructor(private readonly empleadosService: EmpleadosService) {}

    @Post()
    @UseGuards(HrRoleGuard)
    @RequireHrRole()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ 
        summary: 'Crear un nuevo empleado',
        description: 'Crea un nuevo empleado en el sistema, incluyendo su cuenta de usuario. Solo usuarios con rol de RRHH pueden realizar esta acción.'
    })
    @ApiBody({ 
        type: CreateEmployeeDto,
        description: 'Datos del empleado a crear',
        examples: {
            ejemplo: {
                value: {
                    job_title: "Desarrollador Senior",
                    salary: 50000,
                    first_name: "Juan",
                    last_name: "Pérez",
                    email: "juan.perez@empresa.com"
                }
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'El empleado y su cuenta de usuario han sido creados exitosamente',
        type: EmployeeResponseDto
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Ya existe un usuario con el email proporcionado'
    })
    @ApiForbiddenResponse({ description: 'Acceso denegado - Se requiere rol de RRHH' })
    @ApiNotFoundResponse({ description: 'Usuario de RRHH no encontrado' })
    async create(
        @Request() req, 
        @Body() createEmployeeDto: CreateEmployeeDto
    ): Promise<EmployeeResponseDto> {
        const user = req.user as JwtUser;
        if (!user.is_hr) {
            throw new ForbiddenException('Solo los usuarios de RRHH pueden crear empleados');
        }
        return await this.empleadosService.create(createEmployeeDto, user.id);
    }

    @Get()
    @UseGuards(HrRoleGuard)
    @RequireHrRole()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ 
        summary: 'Obtener lista de empleados',
        description: 'Recupera la lista completa de empleados. Solo usuarios con rol de RRHH pueden acceder.'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de empleados recuperada exitosamente',
        type: EmployeeResponseDto,
        isArray: true
    })
    @ApiForbiddenResponse({ description: 'Acceso denegado - Se requiere rol de RRHH' })
    async findAll(@Request() req): Promise<EmployeeResponseDto[]> {
        const user = req.user as JwtUser;
        if (!user.is_hr) {
            throw new ForbiddenException('Solo los usuarios de RRHH pueden listar empleados');
        }
        return await this.empleadosService.findAll();
    }

    @Get(':id')
    @UseGuards(HrRoleGuard)
    @RequireHrRole()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ 
        summary: 'Obtener un empleado por ID',
        description: 'Recupera los detalles de un empleado específico por su ID. Solo usuarios con rol de RRHH pueden acceder.'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'ID del empleado', 
        type: 'number',
        example: 1
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Empleado encontrado exitosamente',
        type: EmployeeResponseDto
    })
    @ApiForbiddenResponse({ description: 'Acceso denegado - Se requiere rol de RRHH' })
    @ApiNotFoundResponse({ description: 'Empleado no encontrado' })
    async findOne(
        @Request() req, 
        @Param('id', ParseIntPipe) id: number
    ): Promise<EmployeeResponseDto> {
        const user = req.user as JwtUser;
        if (!user.is_hr) {
            throw new ForbiddenException('Solo los usuarios de RRHH pueden ver detalles de empleados');
        }
        return await this.empleadosService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(HrRoleGuard)
    @RequireHrRole()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ 
        summary: 'Actualizar un empleado',
        description: 'Actualiza los datos de un empleado específico y su usuario asociado. Solo usuarios con rol de RRHH pueden realizar esta acción.'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'ID del empleado a actualizar', 
        type: 'number',
        example: 1
    })
    @ApiBody({ 
        type: UpdateEmployeeDto,
        description: 'Datos del empleado a actualizar',
        examples: {
            ejemplo: {
                value: {
                    job_title: "Desarrollador Senior",
                    salary: 55000,
                    first_name: "Juan Carlos",
                    last_name: "Pérez González",
                    email: "juan.perez@empresa.com",
                    password: "newpassword123"
                }
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Empleado y usuario actualizados exitosamente',
        type: EmployeeResponseDto
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Ya existe un usuario con el email proporcionado'
    })
    @ApiForbiddenResponse({ description: 'Acceso denegado - Se requiere rol de RRHH' })
    @ApiNotFoundResponse({ description: 'Empleado no encontrado' })
    async update(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateEmployeeDto: UpdateEmployeeDto
    ): Promise<EmployeeResponseDto> {
        const user = req.user as JwtUser;
        if (!user.is_hr) {
            throw new ForbiddenException('Solo los usuarios de RRHH pueden actualizar empleados');
        }
        return await this.empleadosService.update(id, updateEmployeeDto);
    }

    @Delete(':id')
    @UseGuards(HrRoleGuard)
    @RequireHrRole()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ 
        summary: 'Eliminar un empleado',
        description: 'Elimina un empleado específico y su usuario asociado del sistema. Solo usuarios con rol de RRHH pueden realizar esta acción. No se puede eliminar un empleado que tenga documentos asociados.'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'ID del empleado a eliminar', 
        type: 'number',
        example: 1
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Empleado y usuario eliminados exitosamente',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Usuario eliminado correctamente'
                }
            }
        }
    })
    @ApiForbiddenResponse({ description: 'Acceso denegado - Se requiere rol de RRHH' })
    @ApiNotFoundResponse({ description: 'Empleado no encontrado' })
    async remove(
        @Request() req, 
        @Param('id', ParseIntPipe) id: number
    ): Promise<{ message: string }> {
        const user = req.user as JwtUser;
        if (!user.is_hr) {
            throw new ForbiddenException('Solo los usuarios de RRHH pueden eliminar empleados');
        }
        return await this.empleadosService.remove(id);
    }
} 