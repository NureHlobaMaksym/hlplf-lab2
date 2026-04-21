/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

module.exports = class AddAuthColumnsToUsers1776769720000 {
  name = 'AddAuthColumnsToUsers1776769720000'

  /**
   * @param {QueryRunner} queryRunner
   */
  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "username" character varying(40)`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "passwordHash" character varying(255)`);

    await queryRunner.query(`UPDATE "users" SET "username" = CONCAT('user', "id") WHERE "username" IS NULL`);
    await queryRunner.query(`UPDATE "users" SET "passwordHash" = '' WHERE "passwordHash" IS NULL`);

    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "passwordHash" SET NOT NULL`);

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

  /**
   * @param {QueryRunner} queryRunner
   */
  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "UQ_9b8a8d37d39cd040e4fceefe236"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "passwordHash"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "username"`);
  }
}
