import { MigrationInterface, QueryRunner } from "typeorm";

export class SecoundMigration1765162957836 implements MigrationInterface {
    name = 'SecoundMigration1765162957836'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "general_settings" ADD "blog_image" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "general_settings" DROP COLUMN "blog_image"`);
    }

}
