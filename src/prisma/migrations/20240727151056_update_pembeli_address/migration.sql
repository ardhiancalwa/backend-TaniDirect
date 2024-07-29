/*
  Warnings:

  - You are about to drop the column `alamat_pembeli` on the `pembeli` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pembeli` DROP COLUMN `alamat_pembeli`,
    ADD COLUMN `detail_alamat` VARCHAR(191) NULL,
    ADD COLUMN `kecamatan` VARCHAR(191) NULL,
    ADD COLUMN `kode_pos` VARCHAR(191) NULL,
    ADD COLUMN `kota` VARCHAR(191) NULL,
    ADD COLUMN `nama_alamat` VARCHAR(191) NULL,
    ADD COLUMN `provinsi` VARCHAR(191) NULL;
