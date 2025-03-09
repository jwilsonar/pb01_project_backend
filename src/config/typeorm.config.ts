import { DataSource } from 'typeorm';
import { t_users } from '../entities/t_users.entity';
import { t_employees } from '../entities/t_employees';
import { t_document_types } from '../entities/t_document_types.entity';
import { t_employee_documents } from '../entities/t_employee_documents.entity';
import { config } from 'dotenv';

config();

export default new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [t_users, t_employees, t_document_types, t_employee_documents],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
}); 