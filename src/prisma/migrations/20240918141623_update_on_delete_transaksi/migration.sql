-- DropForeignKey
ALTER TABLE "TransaksiProduk" DROP CONSTRAINT "TransaksiProduk_transaksiID_fkey";

-- AddForeignKey
ALTER TABLE "TransaksiProduk" ADD CONSTRAINT "TransaksiProduk_transaksiID_fkey" FOREIGN KEY ("transaksiID") REFERENCES "Transaksi"("no_transaksi") ON DELETE CASCADE ON UPDATE CASCADE;
