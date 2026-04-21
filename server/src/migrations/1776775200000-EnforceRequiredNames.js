/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

module.exports = class EnforceRequiredNames1776775200000 {
  name = 'EnforceRequiredNames1776775200000'

  /**
   * @param {QueryRunner} queryRunner
   */
  async up(queryRunner) {
    await queryRunner.query(`UPDATE "users" SET "firstName" = 'User' WHERE trim("firstName") = ''`);
    await queryRunner.query(`UPDATE "users" SET "lastName" = "firstName" WHERE trim("lastName") = ''`);

    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "firstName" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "lastName" DROP DEFAULT`);

    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "CHK_users_first_name_not_blank"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "CHK_users_last_name_not_blank"`);

    await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "CHK_users_first_name_not_blank" CHECK (length(trim("firstName")) > 0)`);
    await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "CHK_users_last_name_not_blank" CHECK (length(trim("lastName")) > 0)`);
  }

  /**
   * @param {QueryRunner} queryRunner
   */
  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "CHK_users_last_name_not_blank"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "CHK_users_first_name_not_blank"`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "firstName" SET DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "lastName" SET DEFAULT ''`);
  }
}
