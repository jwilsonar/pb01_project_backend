import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { t_employees } from '../entities/t_employees';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { t_users } from '../entities/t_users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmpleadosService {
    constructor(
        @InjectRepository(t_employees)
        private employeesRepository: Repository<t_employees>,
        @InjectRepository(t_users)
        private usersRepository: Repository<t_users>,
    ) {}

    async create(createEmployeeDto: CreateEmployeeDto, createdById: number) {
        // Verificar si ya existe un usuario con ese email
        const existingUser = await this.usersRepository.findOne({
            where: { email: createEmployeeDto.email }
        });

        if (existingUser) {
            throw new ConflictException(`Ya existe un usuario con el email ${createEmployeeDto.email}`);
        }

        // Obtener el usuario de RRHH
        const hrUser = await this.usersRepository.findOne({ 
            where: { id: createdById }
        });
        
        if (!hrUser) {
            throw new NotFoundException(`Usuario HR con ID ${createdById} no encontrado`);
        }

        // Crear el nuevo usuario
        // Crear el hash de la contraseña
        const hashedPassword = await bcrypt.hash(createEmployeeDto.password, 10);
        const newUser = this.usersRepository.create({
            email: createEmployeeDto.email,
            first_name: createEmployeeDto.first_name,
            last_name: createEmployeeDto.last_name,
            is_hr: false, // Por defecto, no es usuario de RRHH
            password: hashedPassword
        });

        const savedUser = await this.usersRepository.save(newUser);

        // Crear el empleado
        const employee = this.employeesRepository.create({
            job_title: createEmployeeDto.job_title,
            salary: createEmployeeDto.salary,
            user: savedUser,
            created_by: hrUser
        },);

        const savedEmployee = await this.employeesRepository.save(employee);
        return this.findOne(savedEmployee.id);
    }

    async findAll() {
        const employees = await this.employeesRepository.find({
            relations: ['user', 'created_by', 'employee_documents'],
            order: {
                id: 'ASC'
            }
        });

        return employees.map(employee => ({
            id: employee.id,
            job_title: employee.job_title,
            salary: employee.salary,
            first_name: employee.user.first_name,
            last_name: employee.user.last_name,
            email: employee.user.email,
            documents_count: employee.employee_documents?.length || 0,
            created_by: {
                id: employee.created_by.id,
                email: employee.created_by.email
            }
        }));
    }

    async findOne(id: number) {
        const employee = await this.employeesRepository.findOne({
            where: { id },
            relations: ['user', 'created_by', 'employee_documents']
        });

        if (!employee) {
            throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
        }

        return {
            id: employee.id,
            job_title: employee.job_title,
            salary: employee.salary,
            first_name: employee.user.first_name,
            last_name: employee.user.last_name,
            email: employee.user.email,
            documents_count: employee.employee_documents?.length || 0,
            created_by: {
                id: employee.created_by.id,
                email: employee.created_by.email
            }
        };
    }

    async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
        const employee = await this.employeesRepository.findOne({
            where: { id },
            relations: ['user', 'created_by', 'employee_documents']
        });

        if (!employee) {
            throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
        }

        // Verificar si se está intentando cambiar el email y si ya existe
        if (updateEmployeeDto.email && updateEmployeeDto.email !== employee.user.email) {
            const existingUser = await this.usersRepository.findOne({
                where: { email: updateEmployeeDto.email }
            });

            if (existingUser) {
                throw new ConflictException(`Ya existe un usuario con el email ${updateEmployeeDto.email}`);
            }
        }

        // Actualizar datos del empleado
        if (updateEmployeeDto.job_title) {
            employee.job_title = updateEmployeeDto.job_title;
        }
        
        if (updateEmployeeDto.salary) {
            employee.salary = updateEmployeeDto.salary;
        }

        // Actualizar datos del usuario
        if (updateEmployeeDto.first_name) {
            employee.user.first_name = updateEmployeeDto.first_name;
        }

        if (updateEmployeeDto.last_name) {
            employee.user.last_name = updateEmployeeDto.last_name;
        }

        if (updateEmployeeDto.email) {
            employee.user.email = updateEmployeeDto.email;
        }

        if (updateEmployeeDto.password) {
            employee.user.password = await bcrypt.hash(updateEmployeeDto.password, 10);
        }

        // Guardar los cambios del usuario
        await this.usersRepository.save(employee.user);

        // Guardar los cambios del empleado
        const updatedEmployee = await this.employeesRepository.save(employee);
        
        return this.findOne(updatedEmployee.id);
    }

    async remove(id: number): Promise<{ message: string }> {
        const employee = await this.employeesRepository.findOne({
            where: { id },
            relations: ['employee_documents', 'user']
        });

        if (!employee) {
            throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
        }

        // Si hay documentos asociados, primero eliminarlos
        if (employee.employee_documents && employee.employee_documents.length > 0) {
            throw new Error('No se puede eliminar un empleado que tiene documentos asociados');
        }

        // Guardar referencia al usuario antes de eliminar el empleado
        const user = employee.user;

        // Eliminar el empleado
        await this.employeesRepository.remove(employee);

        // Eliminar el usuario asociado
        await this.usersRepository.remove(user);

        return { message: 'Usuario eliminado correctamente' };
    }
} 