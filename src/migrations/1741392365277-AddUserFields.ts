import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserFields1741392365277 implements MigrationInterface {
    name = 'AddUserFields1741392365277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Agregar campo is_hr a t_users
        await queryRunner.query(`ALTER TABLE "t_users" ADD "is_hr" boolean NOT NULL DEFAULT false`);

        // Eliminar columnas redundantes de t_employees
        await queryRunner.query(`ALTER TABLE "t_employees" DROP COLUMN IF EXISTS "first_name"`);
        await queryRunner.query(`ALTER TABLE "t_employees" DROP COLUMN IF EXISTS "last_name"`);
        await queryRunner.query(`ALTER TABLE "t_employees" DROP COLUMN IF EXISTS "email"`);
        await queryRunner.query(`ALTER TABLE "t_employees" DROP COLUMN IF EXISTS "password"`);
        await queryRunner.query(`ALTER TABLE "t_employees" DROP COLUMN IF EXISTS "document"`);
        await queryRunner.query(`ALTER TABLE "t_employees" DROP CONSTRAINT IF EXISTS "UQ_employees_email"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir cambios en t_users
        await queryRunner.query(`ALTER TABLE "t_users" DROP COLUMN "is_hr"`);

        // Restaurar columnas en t_employees
        await queryRunner.query(`ALTER TABLE "t_employees" ADD "document" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "t_employees" ADD "first_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "t_employees" ADD "last_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "t_employees" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "t_employees" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "t_employees" ADD CONSTRAINT "UQ_employees_email" UNIQUE ("email")`);
    }
}
