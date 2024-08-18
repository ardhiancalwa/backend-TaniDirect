/*
  Warnings:

  - You are about to drop the column `jumlah_produk` on the `KeranjangProduk` table. All the data in the column will be lost.
  - Added the required column `jumlah` to the `KeranjangProduk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KeranjangProduk" DROP COLUMN "jumlah_produk",
ADD COLUMN     "jumlah" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Produk" ALTER COLUMN "berat_produk" DROP NOT NULL,
ALTER COLUMN "jumlah_produk" DROP NOT NULL;
