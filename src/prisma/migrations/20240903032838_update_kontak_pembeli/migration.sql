/*
  Warnings:

  - You are about to drop the column `detail_alamat` on the `Pembeli` table. All the data in the column will be lost.
  - You are about to drop the column `nama_alamat` on the `Pembeli` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pembeli" DROP COLUMN "detail_alamat",
DROP COLUMN "nama_alamat",
ADD COLUMN     "alamat" TEXT,
ADD COLUMN     "deskripsi" TEXT;
