-- DropForeignKey
ALTER TABLE "PembeliProduk" DROP CONSTRAINT "PembeliProduk_produkID_fkey";

-- DropForeignKey
ALTER TABLE "PetaniProduk" DROP CONSTRAINT "PetaniProduk_produkID_fkey";

-- DropForeignKey
ALTER TABLE "TransaksiProduk" DROP CONSTRAINT "TransaksiProduk_produkID_fkey";

-- AddForeignKey
ALTER TABLE "TransaksiProduk" ADD CONSTRAINT "TransaksiProduk_produkID_fkey" FOREIGN KEY ("produkID") REFERENCES "Produk"("produkID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetaniProduk" ADD CONSTRAINT "PetaniProduk_produkID_fkey" FOREIGN KEY ("produkID") REFERENCES "Produk"("produkID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PembeliProduk" ADD CONSTRAINT "PembeliProduk_produkID_fkey" FOREIGN KEY ("produkID") REFERENCES "Produk"("produkID") ON DELETE CASCADE ON UPDATE CASCADE;
