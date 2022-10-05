/*
  Warnings:

  - A unique constraint covering the columns `[reference]` on the table `countries` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reference]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.
  - The required column `reference` was added to the `countries` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "countries" ADD COLUMN     "reference" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "address_line_1" TEXT NOT NULL,
    "address_line_2" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postcal_code" TEXT NOT NULL,
    "countryId" TEXT,
    "userId" TEXT,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "categories_reference_key" ON "categories"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "categories_id_reference_key" ON "categories"("id", "reference");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_slug_key" ON "addresses"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_reference_key" ON "addresses"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_reference_userId_key" ON "addresses"("reference", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "countries_reference_key" ON "countries"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_reference_key" ON "organizations"("reference");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
