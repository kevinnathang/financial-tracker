/*
  Warnings:

  - You are about to drop the column `category_id` on the `financial_geopoints` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `periodic_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "financial_geopoints" DROP CONSTRAINT "financial_geopoints_category_id_fkey";

-- DropForeignKey
ALTER TABLE "periodic_transactions" DROP CONSTRAINT "periodic_transactions_category_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_category_id_fkey";

-- DropIndex
DROP INDEX "financial_geopoints_category_id_idx";

-- DropIndex
DROP INDEX "periodic_transactions_category_id_idx";

-- DropIndex
DROP INDEX "transactions_category_id_idx";

-- AlterTable
ALTER TABLE "financial_geopoints" DROP COLUMN "category_id",
ADD COLUMN     "tag_id" TEXT;

-- AlterTable
ALTER TABLE "periodic_transactions" DROP COLUMN "category_id",
ADD COLUMN     "tag_id" TEXT;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "category_id",
ADD COLUMN     "tag_id" TEXT;

-- DropTable
DROP TABLE "categories";

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "color" VARCHAR(7) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "financial_geopoints_tag_id_idx" ON "financial_geopoints"("tag_id");

-- CreateIndex
CREATE INDEX "periodic_transactions_tag_id_idx" ON "periodic_transactions"("tag_id");

-- CreateIndex
CREATE INDEX "transactions_tag_id_idx" ON "transactions"("tag_id");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "periodic_transactions" ADD CONSTRAINT "periodic_transactions_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_geopoints" ADD CONSTRAINT "financial_geopoints_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE SET NULL ON UPDATE CASCADE;
