-- AlterTable
ALTER TABLE `usuariotest` ADD COLUMN `ofertaId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `usuariotest` ADD CONSTRAINT `usuariotest_ofertaId_fkey` FOREIGN KEY (`ofertaId`) REFERENCES `oferta`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
