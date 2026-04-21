/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

module.exports = class FirstLastAndDefaultFriendsPrivacy1776772600000 {
  name = 'FirstLastAndDefaultFriendsPrivacy1776772600000'

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "firstName" character varying(80) DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lastName" character varying(80) DEFAULT ''`);

    await queryRunner.query(`UPDATE "users" SET "firstName" = split_part("fullName", ' ', 1) WHERE "firstName" = ''`);
    await queryRunner.query(`UPDATE "users" SET "lastName" = NULLIF(ltrim(replace("fullName", split_part("fullName", ' ', 1), '')), '') WHERE "lastName" = ''`);
    await queryRunner.query(`UPDATE "users" SET "lastName" = 'User' WHERE "lastName" IS NULL OR "lastName" = ''`);

    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "firstName" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "lastName" SET NOT NULL`);

    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "allowMessagesFrom" SET DEFAULT 'friends'`);
    await queryRunner.query(`UPDATE "users" SET "allowMessagesFrom" = 'friends' WHERE "allowMessagesFrom" IS NULL OR "allowMessagesFrom" = 'all'`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "allowMessagesFrom" SET DEFAULT 'all'`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "lastName"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "firstName"`);
  }
}
