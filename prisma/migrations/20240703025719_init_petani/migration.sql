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
