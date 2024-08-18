/*
  Warnings:

  - The `image_produk` column on the `Produk` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Produk" DROP COLUMN "image_produk",
ADD COLUMN     "image_produk" TEXT[],
ALTER COLUMN "berat_produk" SET DEFAULT 20,
ALTER COLUMN "jumlah_produk" SET DEFAULT 1;
