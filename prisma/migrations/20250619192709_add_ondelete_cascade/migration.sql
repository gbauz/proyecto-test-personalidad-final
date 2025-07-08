-- DropForeignKey
ALTER TABLE `postulacion` DROP FOREIGN KEY `postulacion_ofertaId_fkey`;

-- AddForeignKey
ALTER TABLE `postulacion` ADD CONSTRAINT `postulacion_ofertaId_fkey` FOREIGN KEY (`ofertaId`) REFERENCES `oferta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
