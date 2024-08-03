-- CreateTable
CREATE TABLE "Petani" (
    "petaniID" SERIAL NOT NULL,
    "nama_petani" TEXT NOT NULL,
    "provinsi" TEXT,
    "kota" TEXT,
    "kecamatan" TEXT,
    "kode_pos" TEXT,
    "detail_alamat" TEXT,
    "nama_alamat" TEXT,
    "no_telepon_petani" TEXT NOT NULL,
    "email_petani" TEXT NOT NULL,
    "password_petani" TEXT NOT NULL,
    "image_petani" TEXT,
    "tanggal_lahir" TIMESTAMP(3),
    "deskripsi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Petani_pkey" PRIMARY KEY ("petaniID")
);

-- CreateTable
CREATE TABLE "Pembeli" (
    "pembeliID" SERIAL NOT NULL,
    "nama_pembeli" TEXT NOT NULL,
    "email_pembeli" TEXT NOT NULL,
    "password_pembeli" TEXT NOT NULL,
    "kontak_pembeli" TEXT NOT NULL,
    "provinsi" TEXT,
    "kota" TEXT,
    "kecamatan" TEXT,
    "kode_pos" TEXT,
    "detail_alamat" TEXT,
    "nama_alamat" TEXT,
    "tanggal_lahir" TIMESTAMP(3),
    "image_pembeli" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pembeli_pkey" PRIMARY KEY ("pembeliID")
);

-- CreateTable
CREATE TABLE "Transaksi" (
    "no_transaksi" TEXT NOT NULL,
    "tanggal_transaksi" TIMESTAMP(3) NOT NULL,
    "status_transaksi" TEXT NOT NULL,
    "total_harga" DOUBLE PRECISION NOT NULL,
    "metode_pembayaran" TEXT NOT NULL,
    "pembeliID" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaksi_pkey" PRIMARY KEY ("no_transaksi")
);

-- CreateTable
CREATE TABLE "Produk" (
    "produkID" SERIAL NOT NULL,
    "deskripsi_produk" TEXT NOT NULL,
    "harga" DOUBLE PRECISION NOT NULL,
    "jumlah_stok" INTEGER NOT NULL,
    "nama_produk" TEXT NOT NULL,
    "image_produk" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produk_pkey" PRIMARY KEY ("produkID")
);

-- CreateTable
CREATE TABLE "TransaksiProduk" (
    "transaksiID" TEXT NOT NULL,
    "produkID" INTEGER NOT NULL,
    "jumlah" INTEGER NOT NULL,

    CONSTRAINT "TransaksiProduk_pkey" PRIMARY KEY ("transaksiID","produkID")
);

-- CreateTable
CREATE TABLE "PetaniProduk" (
    "petaniID" INTEGER NOT NULL,
    "produkID" INTEGER NOT NULL,

    CONSTRAINT "PetaniProduk_pkey" PRIMARY KEY ("petaniID","produkID")
);

-- CreateTable
CREATE TABLE "PembeliProduk" (
    "pembeliID" INTEGER NOT NULL,
    "produkID" INTEGER NOT NULL,

    CONSTRAINT "PembeliProduk_pkey" PRIMARY KEY ("pembeliID","produkID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Petani_email_petani_key" ON "Petani"("email_petani");

-- CreateIndex
CREATE UNIQUE INDEX "Pembeli_email_pembeli_key" ON "Pembeli"("email_pembeli");

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_pembeliID_fkey" FOREIGN KEY ("pembeliID") REFERENCES "Pembeli"("pembeliID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransaksiProduk" ADD CONSTRAINT "TransaksiProduk_produkID_fkey" FOREIGN KEY ("produkID") REFERENCES "Produk"("produkID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransaksiProduk" ADD CONSTRAINT "TransaksiProduk_transaksiID_fkey" FOREIGN KEY ("transaksiID") REFERENCES "Transaksi"("no_transaksi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetaniProduk" ADD CONSTRAINT "PetaniProduk_petaniID_fkey" FOREIGN KEY ("petaniID") REFERENCES "Petani"("petaniID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetaniProduk" ADD CONSTRAINT "PetaniProduk_produkID_fkey" FOREIGN KEY ("produkID") REFERENCES "Produk"("produkID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PembeliProduk" ADD CONSTRAINT "PembeliProduk_pembeliID_fkey" FOREIGN KEY ("pembeliID") REFERENCES "Pembeli"("pembeliID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PembeliProduk" ADD CONSTRAINT "PembeliProduk_produkID_fkey" FOREIGN KEY ("produkID") REFERENCES "Produk"("produkID") ON DELETE RESTRICT ON UPDATE CASCADE;
