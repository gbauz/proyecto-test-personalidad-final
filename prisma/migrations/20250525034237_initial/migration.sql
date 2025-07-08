-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `roleId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsuarioTest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUsuario` INTEGER NOT NULL,
    `tipoTestId` INTEGER NOT NULL,
    `codigo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoTest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoriaDePreguntas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `orden` INTEGER NOT NULL,
    `tipoTestId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pregunta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pregunta` VARCHAR(191) NOT NULL,
    `categoriaPreguntasId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Respuesta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `puntaje` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RespuestasUsuarioTest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUsuarioTest` INTEGER NOT NULL,
    `idRespuesta` INTEGER NOT NULL,
    `idPregunta` INTEGER NOT NULL,
    `idCategoria` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Personalidades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `keywords` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResultadosDeTest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idDicotomia` INTEGER NOT NULL,
    `idUsuarioTest` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuarioTest` ADD CONSTRAINT `UsuarioTest_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuarioTest` ADD CONSTRAINT `UsuarioTest_tipoTestId_fkey` FOREIGN KEY (`tipoTestId`) REFERENCES `TipoTest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoriaDePreguntas` ADD CONSTRAINT `CategoriaDePreguntas_tipoTestId_fkey` FOREIGN KEY (`tipoTestId`) REFERENCES `TipoTest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pregunta` ADD CONSTRAINT `Pregunta_categoriaPreguntasId_fkey` FOREIGN KEY (`categoriaPreguntasId`) REFERENCES `CategoriaDePreguntas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RespuestasUsuarioTest` ADD CONSTRAINT `RespuestasUsuarioTest_idUsuarioTest_fkey` FOREIGN KEY (`idUsuarioTest`) REFERENCES `UsuarioTest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RespuestasUsuarioTest` ADD CONSTRAINT `RespuestasUsuarioTest_idRespuesta_fkey` FOREIGN KEY (`idRespuesta`) REFERENCES `Respuesta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RespuestasUsuarioTest` ADD CONSTRAINT `RespuestasUsuarioTest_idPregunta_fkey` FOREIGN KEY (`idPregunta`) REFERENCES `Pregunta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RespuestasUsuarioTest` ADD CONSTRAINT `RespuestasUsuarioTest_idCategoria_fkey` FOREIGN KEY (`idCategoria`) REFERENCES `CategoriaDePreguntas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResultadosDeTest` ADD CONSTRAINT `ResultadosDeTest_idDicotomia_fkey` FOREIGN KEY (`idDicotomia`) REFERENCES `Personalidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResultadosDeTest` ADD CONSTRAINT `ResultadosDeTest_idUsuarioTest_fkey` FOREIGN KEY (`idUsuarioTest`) REFERENCES `UsuarioTest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
