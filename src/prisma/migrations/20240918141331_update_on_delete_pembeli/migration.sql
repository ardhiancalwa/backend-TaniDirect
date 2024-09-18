-- DropForeignKey
ALTER TABLE "Keranjang" DROP CONSTRAINT "Keranjang_pembeliID_fkey";

-- DropForeignKey
ALTER TABLE "PembeliProduk" DROP CONSTRAINT "PembeliProduk_pembeliID_fkey";

-- DropForeignKey
ALTER TABLE "PetaniProduk" DROP CONSTRAINT "PetaniProduk_petaniID_fkey";

-- DropForeignKey
ALTER TABLE "Transaksi" DROP CONSTRAINT "Transaksi_pembeliID_fkey";

-- AddForeignKey
ALTER TABLE "Keranjang" ADD CONSTRAINT "Keranjang_pembeliID_fkey" FOREIGN KEY ("pembeliID") REFERENCES "Pembeli"("pembeliID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_pembeliID_fkey" FOREIGN KEY ("pembeliID") REFERENCES "Pembeli"("pembeliID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetaniProduk" ADD CONSTRAINT "PetaniProduk_petaniID_fkey" FOREIGN KEY ("petaniID") REFERENCES "Petani"("petaniID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PembeliProduk" ADD CONSTRAINT "PembeliProduk_pembeliID_fkey" FOREIGN KEY ("pembeliID") REFERENCES "Pembeli"("pembeliID") ON DELETE CASCADE ON UPDATE CASCADE;
