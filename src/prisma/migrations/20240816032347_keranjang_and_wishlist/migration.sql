-- CreateTable
CREATE TABLE "WishlistProduk" (
    "wishlistID" SERIAL NOT NULL,
    "pembeliID" INTEGER NOT NULL,
    "produkID" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WishlistProduk_pkey" PRIMARY KEY ("wishlistID")
);

-- CreateTable
CREATE TABLE "Keranjang" (
    "keranjangID" SERIAL NOT NULL,
    "pembeliID" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Keranjang_pkey" PRIMARY KEY ("keranjangID")
);

-- CreateTable
CREATE TABLE "KeranjangProduk" (
    "keranjangID" INTEGER NOT NULL,
    "produkID" INTEGER NOT NULL,
    "jumlah" INTEGER NOT NULL,

    CONSTRAINT "KeranjangProduk_pkey" PRIMARY KEY ("keranjangID","produkID")
);

-- CreateIndex
CREATE UNIQUE INDEX "WishlistProduk_pembeliID_produkID_key" ON "WishlistProduk"("pembeliID", "produkID");

-- CreateIndex
CREATE UNIQUE INDEX "Keranjang_pembeliID_key" ON "Keranjang"("pembeliID");

-- AddForeignKey
ALTER TABLE "WishlistProduk" ADD CONSTRAINT "WishlistProduk_pembeliID_fkey" FOREIGN KEY ("pembeliID") REFERENCES "Pembeli"("pembeliID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistProduk" ADD CONSTRAINT "WishlistProduk_produkID_fkey" FOREIGN KEY ("produkID") REFERENCES "Produk"("produkID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Keranjang" ADD CONSTRAINT "Keranjang_pembeliID_fkey" FOREIGN KEY ("pembeliID") REFERENCES "Pembeli"("pembeliID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeranjangProduk" ADD CONSTRAINT "KeranjangProduk_produkID_fkey" FOREIGN KEY ("produkID") REFERENCES "Produk"("produkID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeranjangProduk" ADD CONSTRAINT "KeranjangProduk_keranjangID_fkey" FOREIGN KEY ("keranjangID") REFERENCES "Keranjang"("keranjangID") ON DELETE CASCADE ON UPDATE CASCADE;
