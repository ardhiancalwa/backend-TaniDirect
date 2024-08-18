/*
  Warnings:

  - You are about to drop the column `jumlah` on the `KeranjangProduk` table. All the data in the column will be lost.
  - You are about to drop the column `berat_produk` on the `TransaksiProduk` table. All the data in the column will be lost.
  - You are about to drop the column `jumlah` on the `TransaksiProduk` table. All the data in the column will be lost.
  - Added the required column `jumlah_produk` to the `KeranjangProduk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_harga_produk` to the `KeranjangProduk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `berat_produk` to the `Produk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jumlah_produk` to the `Produk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KeranjangProduk" DROP COLUMN "jumlah",
ADD COLUMN     "jumlah_produk" INTEGER NOT NULL,
ADD COLUMN     "total_harga_produk" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Produk" ADD COLUMN     "berat_produk" INTEGER NOT NULL,
ADD COLUMN     "jumlah_produk" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TransaksiProduk" DROP COLUMN "berat_produk",
DROP COLUMN "jumlah";
