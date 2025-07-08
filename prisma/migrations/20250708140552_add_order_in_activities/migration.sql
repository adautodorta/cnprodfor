/*
  Warnings:

  - Added the required column `order` to the `p1Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `stageActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "p1Activity" ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "stageActivity" ADD COLUMN     "order" INTEGER NOT NULL;
