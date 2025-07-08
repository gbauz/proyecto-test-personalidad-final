-- DropForeignKey
ALTER TABLE `postulacion` DROP FOREIGN KEY `postulacion_postulanteId_fkey`;

-- AddForeignKey
ALTER TABLE `postulacion` ADD CONSTRAINT `postulacion_postulanteId_fkey` FOREIGN KEY (`postulanteId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
