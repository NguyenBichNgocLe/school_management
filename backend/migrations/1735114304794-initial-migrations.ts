import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigrations1735114304794 implements MigrationInterface {
  name = 'InitialMigrations1735114304794';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "student" ("id" SERIAL NOT NULL, "studentName" character varying NOT NULL, "clsId" integer, CONSTRAINT "UQ_4f2bd25e9804f702d613a92668f" UNIQUE ("studentName"), CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "class" ("id" SERIAL NOT NULL, "className" character varying NOT NULL, CONSTRAINT "UQ_66afe826b0aceb13f8034675c0f" UNIQUE ("className"), CONSTRAINT "PK_0b9024d21bdfba8b1bd1c300eae" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "student" ADD CONSTRAINT "FK_93c2767875a11ad81ea9b48a271" FOREIGN KEY ("clsId") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student" DROP CONSTRAINT "FK_93c2767875a11ad81ea9b48a271"`,
    );
    await queryRunner.query(`DROP TABLE "class"`);
    await queryRunner.query(`DROP TABLE "student"`);
  }
}
