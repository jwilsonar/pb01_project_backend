import { AppDataSource } from './data-source';

async function resetDatabase() {
    try {
        const connection = await AppDataSource.initialize();
        
        // Eliminar todas las tablas existentes
        await connection.dropDatabase();
        
        // Recrear la base de datos
        await connection.synchronize(true);
        
        console.log('Base de datos reseteada exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('Error al resetear la base de datos:', error);
        process.exit(1);
    }
}

resetDatabase(); 