import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1722075119979 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      CREATE TABLE users (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          username TEXT(1024) NOT NULL UNIQUE,
          pass_hash TEXT NOT NULL
      );
      CREATE INDEX username_uniq_idx ON users (username);
      `,
    );
    await queryRunner.query(
      `
      CREATE TABLE tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          description TEXT(1024) NOT NULL,
          completed INTEGER NOT NULL,
          deadline BIGINT,
          created_at BIGINT NOT NULL,
          created_by INTEGER NOT NULL REFERENCES users (id)
      );
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
