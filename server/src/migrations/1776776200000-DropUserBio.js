/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

module.exports = class DropUserBio1776776200000 {
  name = 'DropUserBio1776776200000'

  /**
   * @param {QueryRunner} queryRunner
   */
  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "bio"`);
  }

  /**
   * @param {QueryRunner} queryRunner
   */
  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "bio" character varying`);
  }
}
