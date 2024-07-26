-- AlterTable
ALTER TABLE `pembeli` ADD COLUMN `tanggal_lahir` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `petani` ADD COLUMN `deskripsi` VARCHAR(191) NULL,
    ADD COLUMN `tanggal_lahir` DATETIME(3) NULL;
