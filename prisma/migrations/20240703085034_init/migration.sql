-- CreateTable
CREATE TABLE `Petani` (
    `petaniID` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_petani` VARCHAR(191) NOT NULL,
    `alamat_petani` VARCHAR(191) NOT NULL,
    `no_telepon_petani` VARCHAR(191) NOT NULL,
    `email_petani` VARCHAR(191) NOT NULL,
    `password_petani` VARCHAR(191) NOT NULL,
    `image_petani` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Petani_email_petani_key`(`email_petani`),
    PRIMARY KEY (`petaniID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kategori` (
    `kategoriID` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kategori` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`kategoriID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Promo` (
    `nama_promo` VARCHAR(191) NOT NULL,
    `deskripsi_promo` VARCHAR(191) NOT NULL,
    `tanggal_dimulai` DATETIME(3) NOT NULL,
    `tanggal_berakhir` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`nama_promo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pembeli` (
    `pembeliID` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_pembeli` VARCHAR(191) NOT NULL,
    `email_pembeli` VARCHAR(191) NOT NULL,
    `password_pembeli` VARCHAR(191) NOT NULL,
    `kontak_pembeli` VARCHAR(191) NOT NULL,
    `alamat_pembeli` VARCHAR(191) NOT NULL,
    `image_pembeli` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Pembeli_email_pembeli_key`(`email_pembeli`),
    PRIMARY KEY (`pembeliID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaksi` (
    `no_transaksi` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal_transaksi` DATETIME(3) NOT NULL,
    `waktu_transaksi` VARCHAR(191) NOT NULL,
    `status_transaksi` VARCHAR(191) NOT NULL,
    `total_harga` DOUBLE NOT NULL,
    `metode_pembayaran` VARCHAR(191) NOT NULL,
    `pembeliID` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`no_transaksi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JadwalPengiriman` (
    `jadwalID` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal_pengiriman` DATETIME(3) NOT NULL,
    `kontak_penerima` VARCHAR(191) NOT NULL,
    `alamat_penerima` VARCHAR(191) NOT NULL,
    `nama_penerima` VARCHAR(191) NOT NULL,
    `estimasi_sampai` DATETIME(3) NOT NULL,
    `biaya_pengiriman` DOUBLE NOT NULL,
    `berat_beban` DOUBLE NOT NULL,
    `transaksiID` INTEGER NOT NULL,
    `distributorID` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`jadwalID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Distributor` (
    `distributorID` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_distributor` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `kontak` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`distributorID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produk` (
    `produkID` INTEGER NOT NULL AUTO_INCREMENT,
    `deskripsi_produk` VARCHAR(191) NOT NULL,
    `harga` DOUBLE NOT NULL,
    `jumlah_stok` INTEGER NOT NULL,
    `nama_produk` VARCHAR(191) NOT NULL,
    `distributorID` INTEGER NOT NULL,
    `kategoriID` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`produkID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KategoriProduk` (
    `produkID` INTEGER NOT NULL,
    `kategoriID` INTEGER NOT NULL,

    PRIMARY KEY (`produkID`, `kategoriID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TransaksiProduk` (
    `transaksiID` INTEGER NOT NULL,
    `produkID` INTEGER NOT NULL,
    `jumlah` INTEGER NOT NULL,

    PRIMARY KEY (`transaksiID`, `produkID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PetaniProduk` (
    `petaniID` INTEGER NOT NULL,
    `produkID` INTEGER NOT NULL,

    PRIMARY KEY (`petaniID`, `produkID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PembeliPromo` (
    `pembeliID` INTEGER NOT NULL,
    `nama_promo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`pembeliID`, `nama_promo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PembeliProduk` (
    `pembeliID` INTEGER NOT NULL,
    `produkID` INTEGER NOT NULL,

    PRIMARY KEY (`pembeliID`, `produkID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_pembeliID_fkey` FOREIGN KEY (`pembeliID`) REFERENCES `Pembeli`(`pembeliID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalPengiriman` ADD CONSTRAINT `JadwalPengiriman_transaksiID_fkey` FOREIGN KEY (`transaksiID`) REFERENCES `Transaksi`(`no_transaksi`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalPengiriman` ADD CONSTRAINT `JadwalPengiriman_distributorID_fkey` FOREIGN KEY (`distributorID`) REFERENCES `Distributor`(`distributorID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produk` ADD CONSTRAINT `Produk_distributorID_fkey` FOREIGN KEY (`distributorID`) REFERENCES `Distributor`(`distributorID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produk` ADD CONSTRAINT `Produk_kategoriID_fkey` FOREIGN KEY (`kategoriID`) REFERENCES `Kategori`(`kategoriID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KategoriProduk` ADD CONSTRAINT `KategoriProduk_produkID_fkey` FOREIGN KEY (`produkID`) REFERENCES `Produk`(`produkID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KategoriProduk` ADD CONSTRAINT `KategoriProduk_kategoriID_fkey` FOREIGN KEY (`kategoriID`) REFERENCES `Kategori`(`kategoriID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransaksiProduk` ADD CONSTRAINT `TransaksiProduk_produkID_fkey` FOREIGN KEY (`produkID`) REFERENCES `Produk`(`produkID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransaksiProduk` ADD CONSTRAINT `TransaksiProduk_transaksiID_fkey` FOREIGN KEY (`transaksiID`) REFERENCES `Transaksi`(`no_transaksi`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PetaniProduk` ADD CONSTRAINT `PetaniProduk_petaniID_fkey` FOREIGN KEY (`petaniID`) REFERENCES `Petani`(`petaniID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PetaniProduk` ADD CONSTRAINT `PetaniProduk_produkID_fkey` FOREIGN KEY (`produkID`) REFERENCES `Produk`(`produkID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PembeliPromo` ADD CONSTRAINT `PembeliPromo_pembeliID_fkey` FOREIGN KEY (`pembeliID`) REFERENCES `Pembeli`(`pembeliID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PembeliPromo` ADD CONSTRAINT `PembeliPromo_nama_promo_fkey` FOREIGN KEY (`nama_promo`) REFERENCES `Promo`(`nama_promo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PembeliProduk` ADD CONSTRAINT `PembeliProduk_pembeliID_fkey` FOREIGN KEY (`pembeliID`) REFERENCES `Pembeli`(`pembeliID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PembeliProduk` ADD CONSTRAINT `PembeliProduk_produkID_fkey` FOREIGN KEY (`produkID`) REFERENCES `Produk`(`produkID`) ON DELETE RESTRICT ON UPDATE CASCADE;
