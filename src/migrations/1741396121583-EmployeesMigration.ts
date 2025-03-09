import { MigrationInterface, QueryRunner } from "typeorm";

export class EmployeesMigration1741396121583 implements MigrationInterface {
    name = 'EmployeesMigration1741396121583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "t_employees" ADD "createdById" integer`);
        await queryRunner.query(`ALTER TABLE "t_employees" DROP CONSTRAINT IF EXISTS "FK_efacb5c3936d42e5ba224fedca5"`);
        await queryRunner.query(`
            DELETE FROM t_employees a
            USING t_employees b
            WHERE a.id > b.id 
            AND a."userId" = b."userId"
        `);
        await queryRunner.query(`ALTER TABLE "t_employees" ADD CONSTRAINT "UQ_efacb5c3936d42e5ba224fedca5" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "t_employees" ADD CONSTRAINT "FK_created_by" FOREIGN KEY ("createdById") REFERENCES "t_users"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "t_employees" DROP CONSTRAINT "FK_created_by"`);
        await queryRunner.query(`ALTER TABLE "t_employees" DROP CONSTRAINT "UQ_efacb5c3936d42e5ba224fedca5"`);
        await queryRunner.query(`ALTER TABLE "t_employees" DROP COLUMN "createdById"`);
        await queryRunner.query(`ALTER TABLE "t_employees" ADD CONSTRAINT "FK_efacb5c3936d42e5ba224fedca5" FOREIGN KEY ("userId") REFERENCES "t_users"("id")`);
    }

}
