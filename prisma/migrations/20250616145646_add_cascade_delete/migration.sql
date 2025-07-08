-- DropForeignKey
ALTER TABLE `oferta` DROP FOREIGN KEY `oferta_creadorId_fkey`;

-- DropForeignKey
ALTER TABLE `perfil` DROP FOREIGN KEY `perfil_userId_fkey`;

-- AddForeignKey
ALTER TABLE `oferta` ADD CONSTRAINT `oferta_creadorId_fkey` FOREIGN KEY (`creadorId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perfil` ADD CONSTRAINT `perfil_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
