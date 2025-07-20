import { PrismaClient } from "@prisma/client";
import path from "path";


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
    if (fields.fotoPerfil) {
  dataToUpdate.fotoPerfil = fields.fotoPerfil;
}

if (fields.curriculum) {
  dataToUpdate.curriculum = fields.curriculum;
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

    // Debe ir dentro de la clase PerfilController
static async updatePerfilFromUpload(req, res) {
  try {
    if (!req.body || typeof req.body !== "object") {
      console.log("⚠️ No se recibió body válido");
      return res.status(400).json({ message: "No se recibió body en la solicitud" });
    }

    console.log("📥 req.body:", req.body);
    console.log("📂 req.files:", req.files);
    console.log("📄 req.file:", req.file);

    const { userId, tipoArchivo } = req.body;

    if (!userId || !tipoArchivo) {
      console.log("❌ Faltan datos requeridos: userId o tipoArchivo");
      return res.status(400).json({ message: "Faltan datos requeridos: userId o tipoArchivo" });
    }

    let filePath = "";

    if (req.file && req.file.secure_url) {
      filePath = req.file.secure_url;
      console.log(`✅ Archivo recibido y subido a Cloudinary. URL: ${filePath}`);
    } else {
      console.log("❌ Archivo no válido o faltante");
      return res.status(400).json({ message: "Archivo no válido o faltante" });
    }

    const updateData = {};

    if (tipoArchivo === "cv") {
      updateData.curriculum = filePath;
    } else if (tipoArchivo === "fotoPerfil") {
      updateData.fotoPerfil = filePath;
    } else {
      return res.status(400).json({ message: "Tipo de archivo no válido" });
    }

    const existingPerfil = await prisma.perfil.findUnique({
      where: { userId: Number(userId) },
    });

    let perfil;

    if (existingPerfil) {
      console.log("ℹ️ Perfil existente encontrado. Procediendo a actualizar...");
      perfil = await prisma.perfil.update({
        where: { userId: Number(userId) },
        data: updateData,
      });
      console.log("✅ Perfil actualizado correctamente.");
    } else {
      console.log("ℹ️ No se encontró perfil. Se intentará crear uno nuevo...");

      // Crear solo el campo correspondiente
      perfil = await prisma.perfil.create({
        data: {
          userId: Number(userId),
          cedula: "",
          sexo: "",
          pais: "",
          ciudad: "",
          curriculum: tipoArchivo === "cv" ? filePath : "",
          fotoPerfil: tipoArchivo === "fotoPerfil" ? filePath : "",
        },
      });

      console.log("✅ Perfil creado exitosamente.");
    }

    return res.json({ message: "Archivo subido y perfil actualizado", perfil });
  } catch (error) {
    console.error("❌ Error en updatePerfilFromUpload:", error);
    return res.status(500).json({ message: "Error al subir archivo", error: error.message });
  }
}





}
