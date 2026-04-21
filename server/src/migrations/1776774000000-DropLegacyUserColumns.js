/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

module.exports = class DropLegacyUserColumns1776774000000 {
  name = 'DropLegacyUserColumns1776774000000'

  /**
   * @param {QueryRunner} queryRunner
   */
  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "UQ_9b8a8d37d39cd040e4fceefe236"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "username"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "fullName"`);
  }

  /**
   * @param {QueryRunner} queryRunner
   */
  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "fullName" character varying(120)`);
    await queryRunner.query(`UPDATE "users" SET "fullName" = CONCAT("firstName", ' ', "lastName") WHERE "fullName" IS NULL`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "fullName" SET NOT NULL`);

    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "username" character varying(40)`);
    await queryRunner.query(`UPDATE "users" SET "username" = CONCAT('user', "id") WHERE "username" IS NULL`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL`);

    await queryRunner.query(`DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'UQ_9b8a8d37d39cd040e4fceefe236'
        ) THEN
          ALTER TABLE "users" ADD CONSTRAINT "UQ_9b8a8d37d39cd040e4fceefe236" UNIQUE ("username");
        END IF;
      END
    $$;`);
  }
}
