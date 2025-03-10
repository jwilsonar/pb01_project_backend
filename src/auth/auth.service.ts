import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { t_users } from '../entities/t_users.entity';
import { t_employees } from '../entities/t_employees.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LogoutDto } from './dto/logout.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { Request } from 'express';
import { S3Service } from '../documents/s3.service';

interface RequestWithUser extends Request {
    user: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        is_hr: boolean;
    };
}

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(t_users)
        private usersRepository: Repository<t_users>,
        @InjectRepository(t_employees)
        private employeesRepository: Repository<t_employees>,
        private jwtService: JwtService,
        private s3Service: S3Service,
    ) {}

    async register(registerDto: RegisterDto) {
        const { password, ...userData } = registerDto;
        
        // Verificar si el usuario ya existe
        const existingUser = await this.usersRepository.findOne({
            where: { email: userData.email },
        });

        if (existingUser) {
            throw new UnauthorizedException('El usuario ya existe');
        }

        // Crear el hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const user = this.usersRepository.create({
            ...userData,
            password: hashedPassword,
            is_hr: false // Por defecto, los usuarios no son de RRHH
        });

        await this.usersRepository.save(user);

        return this.generateToken(user);
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersRepository.findOne({
            where: { email: loginDto.email },
            select: ['id', 'email', 'password', 'first_name', 'last_name', 'is_hr']
        });

        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const isPasswordValid = await bcrypt.compare(
            loginDto.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        return this.generateToken(user);
    }

    async getProfile(req: RequestWithUser): Promise<ProfileResponseDto> {
        const { user } = req;
        
        const usuario = await this.usersRepository.findOne({
            where: { id: user.id }
        });

        // Buscar si el usuario tiene un perfil de empleado con sus documentos activos
        const employee = await this.employeesRepository.findOne({
            where: { user: { id: user.id } },
            relations: [
                'employee_documents',
                'employee_documents.document_type'
            ]
        });

        // Construir la respuesta base
        const response: ProfileResponseDto = {
            id: user.id,
            email: user.email,
            first_name: usuario ? usuario.first_name : '',
            last_name: usuario ? usuario.last_name : '',
            is_hr: usuario ? usuario.is_hr : false
        };

        // Si el usuario es un empleado, agregar los detalles
        if (employee) {
            // Filtrar solo documentos activos
            const activeDocuments = employee.employee_documents.filter(doc => doc.is_active);
            
            response.employee = {
                id: employee.id,
                job_title: employee.job_title,
                salary: employee.salary,
                documents: await Promise.all(activeDocuments.map(async doc => {
                    const key = doc.file_path.replace(`https://${this.s3Service.bucket}.s3.amazonaws.com/`, '');
                    const signedUrl = await this.s3Service.getSignedUrl(key);
                    return {
                        id: doc.id,
                        document_name: doc.file_path.split('/').pop() || 'Sin nombre',
                        document_url: signedUrl,
                        document_type: {
                            id: doc.document_type.id,
                            type_name: doc.document_type.name
                        }
                    };
                }))
            };
        }

        return response;
    }

    private generateToken(user: t_users) {
        const payload = {
            sub: user.id,
            email: user.email,
            is_hr: user.is_hr,
            first_name: user.first_name,
            last_name: user.last_name
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                is_hr: user.is_hr
            },
        };
    }

    async logout(logoutDto: LogoutDto) {
        try {
            // Verificar que el token sea válido
            const decoded = this.jwtService.verify(logoutDto.token);
            
            // Si el token es válido, retornamos mensaje de éxito
            return {
                message: 'Sesión cerrada exitosamente',
                success: true
            };
        } catch (error) {
            throw new UnauthorizedException('Token inválido o expirado');
        }
    }
} 