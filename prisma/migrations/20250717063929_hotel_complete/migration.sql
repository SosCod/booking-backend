/*
  Warnings:

  - The primary key for the `bookings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `bookings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `hotels` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `hotels` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `reviews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `reviews` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `rooms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `rooms` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `special_offers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `special_offers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[name]` on the table `hotels` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `userId` on the `bookings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `roomId` on the `bookings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `reviews` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `hotelId` on the `reviews` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `hotelId` on the `rooms` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_roomId_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_userId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_hotelId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_userId_fkey";

-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_hotelId_fkey";

-- AlterTable
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "roomId",
ADD COLUMN     "roomId" INTEGER NOT NULL,
ADD CONSTRAINT "bookings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "hotels" DROP CONSTRAINT "hotels_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "hotels_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "hotelId",
ADD COLUMN     "hotelId" INTEGER NOT NULL,
ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "hotelId",
ADD COLUMN     "hotelId" INTEGER NOT NULL,
ADD CONSTRAINT "rooms_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "special_offers" DROP CONSTRAINT "special_offers_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "special_offers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "hotels_name_key" ON "hotels"("name");

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
