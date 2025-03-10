import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { t_users } from '../../entities/t_users.entity';
import { t_employees } from '../../entities/t_employees.entity';
import { t_employee_documents } from '../../entities/t_employee_documents.entity';
import { t_document_types } from '../../entities/t_document_types.entity';
import { HrUserSeeder } from './hr-user.seeder';
import { DocumentTypesSeeder } from './document-types.seeder';
import { EmployeeSeeder } from './employee.seeder';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DATABASE_HOST'),
                port: parseInt(configService.get('DATABASE_PORT') || '5432'),
                username: configService.get('DATABASE_USER'),
                password: configService.get('DATABASE_PASSWORD'),
                database: configService.get('DATABASE_NAME'),
                entities: [t_users, t_employees, t_employee_documents, t_document_types],
                synchronize: false,
            }),
        }),
        TypeOrmModule.forFeature([t_users, t_document_types, t_employees])
    ],
    providers: [HrUserSeeder, DocumentTypesSeeder, EmployeeSeeder],
    exports: [HrUserSeeder, DocumentTypesSeeder, EmployeeSeeder]
})
export class SeederModule {} 