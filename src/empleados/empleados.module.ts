import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpleadosService } from './empleados.service';
import { EmpleadosController } from './empleados.controller';
import { t_employees } from '../entities/t_employees.entity';
import { t_users } from '../entities/t_users.entity';
import { S3Service } from '../documents/s3.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([t_employees, t_users])
    ],
    controllers: [EmpleadosController],
    providers: [EmpleadosService, S3Service],
    exports: [EmpleadosService]
})
export class EmpleadosModule {} 