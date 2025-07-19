// routes/upload.js
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import cloudinary from '../utils/cloudinary.js';
import { PerfilController } from '../controllers/perfilController.js';


const router = express.Router();
const upload = multer({ dest: 'temp/' });

router.post('/upload-cv', upload.single('file'), async (req, res) => {
  try {
    console.log('🧾 req.body:', req.body);
    console.log('📂 req.file:', req.file);
  const { userId, tipoArchivo } = req.body;
    if (!userId || !tipoArchivo || !req.file) {
      return res.status(400).json({ message: 'Archivo no válido o faltante' });
    }

    const filePath = req.file.path;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: tipoArchivo === 'fotoPerfil' ? 'fotos' : 'cv',
      public_id: uuidv4(),
      resource_type: 'auto',
    });

    fs.unlinkSync(filePath);

    // Simular estructura para el controller
    req.file.secure_url = result.secure_url;
    req.body = { userId, tipoArchivo };

    // Llamada directa con req y res (ya maneja la respuesta internamente)
    await PerfilController.updatePerfilFromUpload(req, res);

    // ❌ NO pongas más res.json() aquí porque ya fue enviado desde el controller
  } catch (error) {
    console.error('❌ Error al subir archivo:', error);

    // Solo responde si no se ha enviado antes
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error al subir archivo y actualizar perfil' });
    }
  }
});


export default router;
