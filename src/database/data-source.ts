import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { t_users } from '../entities/t_users.entity';
import { t_employees } from '../entities/t_employees.entity';
import { t_document_types } from '../entities/t_document_types.entity';
import { t_employee_documents } from '../entities/t_employee_documents.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [t_users, t_employees, t_document_types, t_employee_documents],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  cache: {
    duration: 30000 // 30 segundos de caché
  },
  poolSize: 10,
  extra: {
    max: 10,
    connectionTimeoutMillis: 10000,
  }
}); 