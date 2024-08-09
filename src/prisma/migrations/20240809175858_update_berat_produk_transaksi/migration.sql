/*
  Warnings:

  - You are about to drop the column `berat_produk` on the `Transaksi` table. All the data in the column will be lost.
  - Added the required column `berat_produk` to the `TransaksiProduk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaksi" DROP COLUMN "berat_produk";

-- AlterTable
ALTER TABLE "TransaksiProduk" ADD COLUMN     "berat_produk" INTEGER NOT NULL;
