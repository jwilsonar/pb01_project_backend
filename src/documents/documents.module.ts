import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsController } from './documents.controller';
import { S3Service } from './s3.service';
import { t_employee_documents } from '../entities/t_employee_documents.entity';
import { t_users } from '../entities/t_users.entity';
import { ConfigModule } from '@nestjs/config';
import { t_employees } from '../entities/t_employees.entity';
import { t_document_types } from '../entities/t_document_types.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([t_employee_documents, t_users, t_employees, t_document_types]),
        ConfigModule
    ],
    controllers: [DocumentsController],
    providers: [S3Service],
})
export class DocumentsModule {} 