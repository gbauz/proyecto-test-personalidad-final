import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const apiResponse = (isSuccess, message, data = null) => ({ isSuccess, message, data });

export class UserController {
  static async getUsuariosConRoles(req, res) {
    try {
      const usuarios = await prisma.user.findMany({ include: { role: true } });

      const data = usuarios.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role?.name || 'Sin rol',
      }));

      res.json(apiResponse(true, 'Usuarios obtenidos correctamente', data));
    } catch (error) {
      console.error(error);
      res.status(500).json(apiResponse(false, 'Error al obtener usuarios'));
    }
  }

  static async updateUserStructured(req, res) {
    const { id, name, email, roleId } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { id: Number(id) } });
      if (!user) {
        return res.status(404).json(apiResponse(false, "Usuario no encontrado"));
      }

      const resolvedRoleId = (!roleId || roleId === 0) ? user.roleId : roleId;

      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: { name, email, roleId: resolvedRoleId },
      });

      res.json(apiResponse(true, "Usuario actualizado correctamente", updatedUser));
    } catch (error) {
      console.error(error);
      res.status(500).json(apiResponse(false, "Error al actualizar usuario"));
    }
  }

  static async deleteUserStructured(req, res) {
    const { id } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { id: Number(id) } });
      if (!user) {
        return res.status(404).json(apiResponse(false, "Usuario no encontrado"));
      }

      await prisma.user.delete({ where: { id: Number(id) } });
      res.json(apiResponse(true, "Usuario eliminado correctamente"));
    } catch (error) {
      console.error(error);
      res.status(500).json(apiResponse(false, "Error al eliminar usuario"));
    }
  }
}
