import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs/promises";

const prisma = new PrismaClient();
const apiResponse = (isSuccess, message, data = null) => ({ isSuccess, message, data });

const UPLOAD_DIR_FOTOS = path.join(process.cwd(), "uploads", "fotos");
const UPLOAD_DIR_CV = path.join(process.cwd(), "uploads", "cv");

export class PerfilController {
  // Obtener perfil con name/email del user
  static async getPerfilByUserId(req, res) {
    const userId = Number(req.params.userId);
    try {
      const perfil = await prisma.perfil.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      if (!perfil) {
        return res.json(apiResponse(true, "Perfil no encontrado", null));
      }

      const responsePerfil = {
        ...perfil,
        name: perfil.user.name,
        email: perfil.user.email,
      };

      delete responsePerfil.user;

      res.json(apiResponse(true, "Perfil encontrado", responsePerfil));
    } catch (error) {
      console.error("❌ Error al obtener perfil:", error);
      res.status(500).json(apiResponse(false, "Error al obtener perfil"));
    }
  }

  // Actualizar perfil y user
  static async updatePerfil(req, res) {
    try {
      console.log("📥 req.body:", req.body);
      console.log("📂 req.files:", req.files);

      const fields = req.body;
      const userId = Number(fields.userId);
      const { cedula, sexo, pais, ciudad, name, email } = fields;

      if (!userId) return res.status(400).json(apiResponse(false, "Falta userId"));

      const dataToUpdate = { cedula, sexo, pais, ciudad };

      // Procesar archivos
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          if (file.fieldname === "fotoPerfil") {
            const newFotoPath = path.join("uploads", "fotos", file.originalname);
            await fs.rename(file.path, newFotoPath);
            dataToUpdate.fotoPerfil = newFotoPath;
          }

          if (file.fieldname === "curriculum") {
            const newCvPath = path.join("uploads", "cv", file.originalname);
            await fs.rename(file.path, newCvPath);
            dataToUpdate.curriculum = newCvPath;
          }
        }
      }

      // Actualizar o crear perfil
      let perfil;
      const existingPerfil = await prisma.perfil.findUnique({ where: { userId } });

      if (existingPerfil) {
        perfil = await prisma.perfil.update({
          where: { userId },
          data: dataToUpdate,
        });
      } else {
        perfil = await prisma.perfil.create({
          data: {
            userId,
            ...dataToUpdate,
          },
        });
      }

      // Actualizar tabla user
      if (name && email) {
        await prisma.user.update({
          where: { id: userId },
          data: { name, email },
        });
      }

      res.json(apiResponse(true, "Perfil actualizado correctamente", perfil));
    } catch (error) {
      console.error("❌ Error al actualizar perfil:", error);
      res.status(500).json(apiResponse(false, "Error al actualizar perfil"));
    }
  }
}
