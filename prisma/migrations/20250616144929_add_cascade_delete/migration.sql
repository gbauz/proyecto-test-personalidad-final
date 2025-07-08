-- DropForeignKey
ALTER TABLE `respuestasusuariotest` DROP FOREIGN KEY `RespuestasUsuarioTest_idUsuarioTest_fkey`;

-- DropForeignKey
ALTER TABLE `resultadosdetest` DROP FOREIGN KEY `resultadosdetest_idUsuarioTest_fkey`;

-- DropForeignKey
ALTER TABLE `usuariotest` DROP FOREIGN KEY `UsuarioTest_idUsuario_fkey`;

-- AddForeignKey
ALTER TABLE `respuestasusuariotest` ADD CONSTRAINT `RespuestasUsuarioTest_idUsuarioTest_fkey` FOREIGN KEY (`idUsuarioTest`) REFERENCES `usuariotest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resultadosdetest` ADD CONSTRAINT `resultadosdetest_idUsuarioTest_fkey` FOREIGN KEY (`idUsuarioTest`) REFERENCES `usuariotest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuariotest` ADD CONSTRAINT `UsuarioTest_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
