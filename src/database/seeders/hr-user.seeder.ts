import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { t_users } from '../../entities/t_users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HrUserSeeder {
    constructor(
        @InjectRepository(t_users)
        private readonly usersRepository: Repository<t_users>,
    ) {}

    async seed() {
        // Verificar si ya existe un usuario de RRHH
        const existingHrUser = await this.usersRepository.findOne({
            where: { email: 'rrhh@empresa.com' }
        });

        if (existingHrUser) {
            console.log('El usuario de RRHH ya existe');
            return;
        }

        // Crear el hash de la contraseña
        const hashedPassword = await bcrypt.hash('Rrhh2024!', 10);

        // Crear el usuario de RRHH
        const hrUser = this.usersRepository.create({
            first_name: 'Administrador',
            last_name: 'RRHH',
            email: 'rrhh@empresa.com',
            password: hashedPassword,
            is_hr: true
        });

        await this.usersRepository.save(hrUser);
        console.log('Usuario de RRHH creado exitosamente');
    }
} 