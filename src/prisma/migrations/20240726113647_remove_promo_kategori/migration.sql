/*
  Warnings:

  - You are about to drop the column `kategoriID` on the `produk` table. All the data in the column will be lost.
  - You are about to drop the `kategori` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `kategoriproduk` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pembelipromo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `promo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `kategoriproduk` DROP FOREIGN KEY `KategoriProduk_kategoriID_fkey`;

-- DropForeignKey
ALTER TABLE `kategoriproduk` DROP FOREIGN KEY `KategoriProduk_produkID_fkey`;

-- DropForeignKey
ALTER TABLE `pembelipromo` DROP FOREIGN KEY `PembeliPromo_nama_promo_fkey`;

-- DropForeignKey
ALTER TABLE `pembelipromo` DROP FOREIGN KEY `PembeliPromo_pembeliID_fkey`;

-- DropForeignKey
ALTER TABLE `produk` DROP FOREIGN KEY `Produk_kategoriID_fkey`;

-- AlterTable
ALTER TABLE `produk` DROP COLUMN `kategoriID`;

-- DropTable
DROP TABLE `kategori`;

-- DropTable
DROP TABLE `kategoriproduk`;

-- DropTable
DROP TABLE `pembelipromo`;

-- DropTable
DROP TABLE `promo`;
