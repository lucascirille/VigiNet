/*
  Warnings:

  - You are about to drop the column `calle1` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `calle2` on the `Usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "calle1",
DROP COLUMN "calle2";
