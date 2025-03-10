import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { HrUserSeeder } from './hr-user.seeder';
import { DocumentTypesSeeder } from './document-types.seeder';
import { EmployeeSeeder } from './employee.seeder';

async function bootstrap() {
    const appContext = await NestFactory.createApplicationContext(SeederModule);

    try {
        // Ejecutar el seeder de usuario RRHH
        const hrUserSeeder = appContext.get(HrUserSeeder);
        await hrUserSeeder.seed();
        
        // Ejecutar el seeder de tipos de documentos
        const documentTypesSeeder = appContext.get(DocumentTypesSeeder);
        await documentTypesSeeder.seed();
        console.log('Seeding completado exitosamente');
    } catch (error) {
        console.error('Error durante el seeding:', error);
        throw error;
    } finally {
        await appContext.close();
    }
}

bootstrap(); 