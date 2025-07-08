/*
  Warnings:

  - You are about to drop the `usuario_oferta_personalidad` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[idUsuarioTest]` on the table `resultadosdetest` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `resultadosdetest` DROP FOREIGN KEY `ResultadosDeTest_idUsuarioTest_fkey`;

-- DropForeignKey
ALTER TABLE `usuario_oferta_personalidad` DROP FOREIGN KEY `UOP_ofertaId_fkey`;

-- DropForeignKey
ALTER TABLE `usuario_oferta_personalidad` DROP FOREIGN KEY `UOP_personalidadId_fkey`;

-- DropForeignKey
ALTER TABLE `usuario_oferta_personalidad` DROP FOREIGN KEY `UOP_userId_fkey`;

-- DropTable
DROP TABLE `usuario_oferta_personalidad`;

-- CreateIndex
CREATE UNIQUE INDEX `resultadosdetest_idUsuarioTest_key` ON `resultadosdetest`(`idUsuarioTest`);

-- AddForeignKey
ALTER TABLE `resultadosdetest` ADD CONSTRAINT `resultadosdetest_idUsuarioTest_fkey` FOREIGN KEY (`idUsuarioTest`) REFERENCES `usuariotest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
