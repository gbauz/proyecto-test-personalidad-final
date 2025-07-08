-- CreateTable
CREATE TABLE `usuario_oferta_personalidad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `ofertaId` INTEGER NOT NULL,
    `personalidadId` INTEGER NOT NULL,

    INDEX `UOP_userId_fkey`(`userId`),
    INDEX `UOP_ofertaId_fkey`(`ofertaId`),
    INDEX `UOP_personalidadId_fkey`(`personalidadId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuario_oferta_personalidad` ADD CONSTRAINT `UOP_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_oferta_personalidad` ADD CONSTRAINT `UOP_ofertaId_fkey` FOREIGN KEY (`ofertaId`) REFERENCES `oferta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_oferta_personalidad` ADD CONSTRAINT `UOP_personalidadId_fkey` FOREIGN KEY (`personalidadId`) REFERENCES `personalidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
