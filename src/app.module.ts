import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { t_users } from './entities/t_users.entity';
import { t_employees } from './entities/t_employees';
import { t_document_types } from './entities/t_document_types.entity';
import { t_employee_documents } from './entities/t_employee_documents.entity';
import { config } from 'dotenv';
import { EmpleadosModule } from './empleados/empleados.module';
import { DocumentTypesModule } from './document_types/document-types.module';
import { DocumentsModule } from './documents/documents.module';
config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
        entities: [t_users, t_employees, t_document_types, t_employee_documents],
        synchronize: false,
        logging: true,
      }),
    }),
    AuthModule,
    EmpleadosModule,
    DocumentTypesModule,
    DocumentsModule,
  ],
})
export class AppModule {}
