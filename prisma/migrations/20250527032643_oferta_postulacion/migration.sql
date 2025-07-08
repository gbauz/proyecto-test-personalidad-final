-- CreateTable
CREATE TABLE `oferta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `sueldo` DOUBLE NOT NULL,
    `modalidad` VARCHAR(191) NOT NULL,
    `creadorId` INTEGER NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `postulacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ofertaId` INTEGER NOT NULL,
    `postulanteId` INTEGER NOT NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `oferta` ADD CONSTRAINT `oferta_creadorId_fkey` FOREIGN KEY (`creadorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `postulacion` ADD CONSTRAINT `postulacion_ofertaId_fkey` FOREIGN KEY (`ofertaId`) REFERENCES `oferta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `postulacion` ADD CONSTRAINT `postulacion_postulanteId_fkey` FOREIGN KEY (`postulanteId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
