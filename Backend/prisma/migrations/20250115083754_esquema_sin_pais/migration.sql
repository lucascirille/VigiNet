/*
  Warnings:

  - You are about to drop the column `paisId` on the `Provincia` table. All the data in the column will be lost.
  - You are about to drop the `Pais` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Provincia" DROP CONSTRAINT "Provincia_paisId_fkey";

-- AlterTable
CREATE SEQUENCE provincia_provinciaid_seq;
ALTER TABLE "Provincia" DROP COLUMN "paisId",
ALTER COLUMN "provinciaId" SET DEFAULT nextval('provincia_provinciaid_seq');
ALTER SEQUENCE provincia_provinciaid_seq OWNED BY "Provincia"."provinciaId";

-- DropTable
DROP TABLE "Pais";
