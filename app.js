import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from 'cors';
import router from './my-page/backend/routes/index.js';
import uploadRouter from './my-page/backend/routes/upload.js'; // importa la nueva ruta
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
});

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', uploadRouter); 

// ✅ Monta todas las rutas desde index.js bajo /api
app.use('/api', router);

export default app;
