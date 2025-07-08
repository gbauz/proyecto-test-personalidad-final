/*
  Warnings:

  - You are about to drop the column `createdAt` on the `perfil` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `postulacion` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `resultadosdetest` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `usuariotest` table. All the data in the column will be lost.
  - You are about to drop the column `testCompleted` on the `usuariotest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `perfil` DROP COLUMN `createdAt`;

-- AlterTable
ALTER TABLE `postulacion` DROP COLUMN `createdAt`;

-- AlterTable
ALTER TABLE `resultadosdetest` DROP COLUMN `createdAt`;

-- AlterTable
ALTER TABLE `usuariotest` DROP COLUMN `createdAt`,
    DROP COLUMN `testCompleted`;
