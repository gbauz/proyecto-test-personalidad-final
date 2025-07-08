-- CreateTable
CREATE TABLE `perfil` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `cedula` VARCHAR(191) NOT NULL,
    `sexo` VARCHAR(191) NOT NULL,
    `pais` VARCHAR(191) NOT NULL,
    `ciudad` VARCHAR(191) NOT NULL,
    `fotoPerfil` VARCHAR(191) NOT NULL,
    `curriculum` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `perfil_userId_key`(`userId`),
    INDEX `perfil_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `perfil` ADD CONSTRAINT `perfil_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
