/*
  Warnings:

  - You are about to drop the column `type` on the `categories` table. All the data in the column will be lost.
  - Made the column `color` on table `categories` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "financial_geopoints" DROP CONSTRAINT "financial_geopoints_category_id_fkey";

-- DropForeignKey
ALTER TABLE "periodic_transactions" DROP CONSTRAINT "periodic_transactions_category_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_category_id_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "type",
ALTER COLUMN "color" SET NOT NULL;

-- AlterTable
ALTER TABLE "financial_geopoints" ALTER COLUMN "category_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "periodic_transactions" ALTER COLUMN "category_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "category_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "periodic_transactions" ADD CONSTRAINT "periodic_transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_geopoints" ADD CONSTRAINT "financial_geopoints_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
