/*
  Warnings:

  - You are about to drop the column `alamat_petani` on the `petani` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `petani` DROP COLUMN `alamat_petani`,
    ADD COLUMN `detail_alamat` VARCHAR(191) NULL,
    ADD COLUMN `kecamatan` VARCHAR(191) NULL,
    ADD COLUMN `kode_pos` VARCHAR(191) NULL,
    ADD COLUMN `kota` VARCHAR(191) NULL,
    ADD COLUMN `nama_alamat` VARCHAR(191) NULL,
    ADD COLUMN `provinsi` VARCHAR(191) NULL;
