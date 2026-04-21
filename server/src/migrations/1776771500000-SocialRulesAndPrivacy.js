/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

module.exports = class SocialRulesAndPrivacy1776771500000 {
  name = 'SocialRulesAndPrivacy1776771500000'

  /**
   * @param {QueryRunner} queryRunner
   */
  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "allowMessagesFrom" character varying(20) DEFAULT 'all'`);
    await queryRunner.query(`UPDATE "users" SET "allowMessagesFrom" = 'all' WHERE "allowMessagesFrom" IS NULL`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "allowMessagesFrom" SET NOT NULL`);

    await queryRunner.query(`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "visibility" character varying(20) DEFAULT 'public'`);
    await queryRunner.query(`UPDATE "posts" SET "visibility" = 'public' WHERE "visibility" IS NULL`);
    await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "visibility" SET NOT NULL`);

    await queryRunner.query(`ALTER TABLE "friendships" ADD COLUMN IF NOT EXISTS "status" character varying(20) DEFAULT 'accepted'`);
    await queryRunner.query(`ALTER TABLE "friendships" ADD COLUMN IF NOT EXISTS "respondedAt" TIMESTAMP`);
    await queryRunner.query(`UPDATE "friendships" SET "status" = 'accepted' WHERE "status" IS NULL`);
    await queryRunner.query(`UPDATE "friendships" SET "respondedAt" = now() WHERE "respondedAt" IS NULL`);
    await queryRunner.query(`ALTER TABLE "friendships" ALTER COLUMN "status" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "friendships" ALTER COLUMN "status" SET DEFAULT 'pending'`);

    await queryRunner.query(`ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "isRead" boolean DEFAULT false`);
    await queryRunner.query(`UPDATE "messages" SET "isRead" = true WHERE "isRead" IS NULL`);
    await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "isRead" SET NOT NULL`);
  }

  /**
   * @param {QueryRunner} queryRunner
   */
  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN IF EXISTS "isRead"`);
    await queryRunner.query(`ALTER TABLE "friendships" DROP COLUMN IF EXISTS "respondedAt"`);
    await queryRunner.query(`ALTER TABLE "friendships" DROP COLUMN IF EXISTS "status"`);
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN IF EXISTS "visibility"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "allowMessagesFrom"`);
  }
}
