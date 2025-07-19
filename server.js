import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from 'cors';
import router from './my-page/backend/routes/index.js'; // ⬅ este es tu index.js con /auth y /test
import uploadRouter from './my-page/backend/routes/upload.js'; 

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear carpetas necesarias
const uploadDirs = [
  path.join(__dirname, 'uploads'),
  path.join(__dirname, 'uploads', 'fotos'),
  path.join(__dirname, 'uploads', 'cv'),
  path.join(__dirname, 'temp'),
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Carpeta creada: ${dir}`);
  }
});1

// Middlewares
app.use(express.json());
app.use(cors());

// Archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Monta todas las rutas desde tu index.js bajo /api
app.use('/api', uploadRouter); 
app.use('/api', router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express escuchando en http://localhost:${PORT}`);
});
