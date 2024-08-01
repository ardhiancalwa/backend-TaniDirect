/*
  Warnings:

  - The primary key for the `transaksi` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `transaksiproduk` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `transaksiproduk` DROP FOREIGN KEY `TransaksiProduk_transaksiID_fkey`;

-- AlterTable
ALTER TABLE `transaksi` DROP PRIMARY KEY,
    MODIFY `no_transaksi` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`no_transaksi`);

-- AlterTable
ALTER TABLE `transaksiproduk` DROP PRIMARY KEY,
    MODIFY `transaksiID` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`transaksiID`, `produkID`);

-- AddForeignKey
ALTER TABLE `TransaksiProduk` ADD CONSTRAINT `TransaksiProduk_transaksiID_fkey` FOREIGN KEY (`transaksiID`) REFERENCES `Transaksi`(`no_transaksi`) ON DELETE RESTRICT ON UPDATE CASCADE;
