import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { t_users } from '../../entities/t_users.entity';
import { t_employees } from '../../entities/t_employees';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeeSeeder {
    constructor(
        @InjectRepository(t_users)
        private readonly usersRepository: Repository<t_users>,
        @InjectRepository(t_employees)
        private readonly employeesRepository: Repository<t_employees>,
    ) {}

    async seed() {
        // Obtener el usuario de RRHH
        const hrUser = await this.usersRepository.findOne({
            where: { email: 'rrhh@empresa.com' }
        });

        if (!hrUser) {
            console.log('Error: Usuario de RRHH no encontrado');
            return;
        }

        const jobTitles = [
            'Desarrollador Frontend',
            'Desarrollador Backend',
            'Diseñador UX/UI',
            'Project Manager',
            'QA Engineer',
            'DevOps Engineer',
            'Data Scientist',
            'Product Owner',
            'Scrum Master',
            'Technical Lead'
        ];

        for (let i = 1; i <= 80; i++) {
            const firstName = `Empleado${i}`;
            const lastName = `Apellido${i}`;
            const email = `empleado${i}@empresa.com`;
            const password = await bcrypt.hash(`Empleado${i}2024!`, 10);
            const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
            const salary = Math.floor(Math.random() * (80000 - 30000) + 30000);

            // Crear usuario
            const user = this.usersRepository.create({
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password,
                is_hr: false
            });

            const savedUser = await this.usersRepository.save(user);

            // Crear empleado
            const employee = this.employeesRepository.create({
                job_title: jobTitle,
                salary: salary,
                user: savedUser,
                created_by: hrUser
            });

            await this.employeesRepository.save(employee);
            console.log(`Empleado ${i} creado exitosamente`);
        }

        console.log('Seeding de empleados completado exitosamente');
    }
} 