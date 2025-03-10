import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1741587582916 implements MigrationInterface {
    name = 'InitialMigration1741587582916'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "t_document_types" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_c4a89a2f99d8a5ef0ed34183654" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "t_employee_documents" ("id" SERIAL NOT NULL, "document_type_id" integer NOT NULL, "employee_id" integer NOT NULL, "file_path" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_cd5bcfbb408a8da411220b21610" UNIQUE ("employee_id", "document_type_id"), CONSTRAINT "PK_f24bade942ef955b13ebdfccd0c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "t_employees" ("id" SERIAL NOT NULL, "job_title" character varying NOT NULL, "salary" integer NOT NULL, "userId" integer, "created_by" integer, CONSTRAINT "REL_efacb5c3936d42e5ba224fedca" UNIQUE ("userId"), CONSTRAINT "PK_aa4d122590b029017d031a26123" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "t_users" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "is_hr" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_1b1275aba2e3044ce094936619c" UNIQUE ("email"), CONSTRAINT "PK_45e27b946b7f8cd527fd4fbe658" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "t_employee_documents" ADD CONSTRAINT "FK_72a48fc6ae16f67b116b45bbbca" FOREIGN KEY ("document_type_id") REFERENCES "t_document_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_employee_documents" ADD CONSTRAINT "FK_161a6c75b052c35c6219bc9568e" FOREIGN KEY ("employee_id") REFERENCES "t_employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_employees" ADD CONSTRAINT "FK_efacb5c3936d42e5ba224fedca5" FOREIGN KEY ("userId") REFERENCES "t_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_employees" ADD CONSTRAINT "FK_371292e53034b925886d8ab3499" FOREIGN KEY ("created_by") REFERENCES "t_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "t_employees" DROP CONSTRAINT "FK_371292e53034b925886d8ab3499"`);
        await queryRunner.query(`ALTER TABLE "t_employees" DROP CONSTRAINT "FK_efacb5c3936d42e5ba224fedca5"`);
        await queryRunner.query(`ALTER TABLE "t_employee_documents" DROP CONSTRAINT "FK_161a6c75b052c35c6219bc9568e"`);
        await queryRunner.query(`ALTER TABLE "t_employee_documents" DROP CONSTRAINT "FK_72a48fc6ae16f67b116b45bbbca"`);
        await queryRunner.query(`DROP TABLE "t_users"`);
        await queryRunner.query(`DROP TABLE "t_employees"`);
        await queryRunner.query(`DROP TABLE "t_employee_documents"`);
        await queryRunner.query(`DROP TABLE "t_document_types"`);
    }

}
