import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
// import  sendRecoveryEmail from '../utils/mailer';
import crypto from 'crypto';
import { sendRecoveryEmail } from '../utils/mailer.js';






const prisma = new PrismaClient();
const SECRET_KEY = 'tu_clave_secreta';

const apiResponse = (isSuccess, message, data = null) => ({
  isSuccess,
  message,
  data,
});

export const register = async (req, res) => {
  let { email, password, name, roleId } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json(apiResponse(false, 'El usuario ya existe'));
    }

    const DEFAULT_ROLE_ID = 2;
    roleId = (!roleId || roleId === 1) ? DEFAULT_ROLE_ID : roleId;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, name, roleId },
    });

    res.status(201).json(apiResponse(true, 'Usuario registrado exitosamente', newUser));
  } catch (error) {
    console.error(error);
    res.status(500).json(apiResponse(false, 'Error en el servidor'));
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        usuariotest: {
          where: {
            testCompleted: true,
            isActive: true,
          },
          orderBy: {
            createdAt: 'desc', // ✅ usa el campo correcto
          },
          take: 1,
        },
      },
    });

    if (!user) {
      return res.status(400).json(apiResponse(false, 'Credenciales incorrectas'));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json(apiResponse(false, 'Credenciales incorrectas'));
    }

    if (!user.role || !user.role.name) {
      return res.status(400).json(apiResponse(false, 'El usuario no tiene un rol asignado'));
    }

    const token = jwt.sign(
      { userId: user.id, role: user.roleId },
      SECRET_KEY,
      { expiresIn: '10h' }
    );

    const testCompletado = user.usuariotest.length > 0;
    const idUsuarioTest = testCompletado ? user.usuariotest[0].id : null;

    res.json(apiResponse(true, 'Login exitoso', {
      token,
      user: {
        id: user.id,
        nombre: user.name,
        roleName: user.role.name,
        testCompleted: testCompletado,
        idUsuarioTest: idUsuarioTest,
      },
    }));
  } catch (error) {
    console.error(error);
    res.status(500).json(apiResponse(false, 'Error en el servidor'));
  }
};


export const getRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      select: { id: true, name: true },
    });

    const formatted = roles.map(role => ({
      value: role.id,
      label: role.name,
    }));

    res.json(apiResponse(true, 'Roles obtenidos correctamente', formatted));
  } catch (error) {
    console.error(error);
    res.status(500).json(apiResponse(false, 'No se pudieron obtener los roles'));
  }
};


// ✅ Ruta: GET /api/test/verificar-pendiente/:idUsuario
export const verificarTestPendiente = async (req, res) => {
  const idUsuario = parseInt(req.params.idUsuario);

  if (!idUsuario) {
    return res.status(400).json(apiResponse(false, 'Falta el ID de usuario'));
  }

  try {
    const testPendiente = await prisma.usuariotest.findFirst({
      where: {
        idUsuario,
        isActive: true,
        testCompleted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (testPendiente) {
      return res.json(apiResponse(true, 'Test pendiente encontrado', {
        idUsuarioTest: testPendiente.id,
      }));
    } else {
      return res.json(apiResponse(true, 'No hay test pendiente', null));
    }
  } catch (error) {
    console.error('Error al verificar test pendiente:', error);
    return res.status(500).json(apiResponse(false, 'Error interno del servidor'));
  }
};





// ✅ Ruta: POST /api/auth/recuperar-contrasena

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ isSuccess: false, message: 'Correo no registrado' });
    }

    // Generar token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hora

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExp: expires,
      },
    });

    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    const html = `
      <h3>Recuperación de contraseña</h3>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetLink}">${resetLink}</a>
    `;

    await sendRecoveryEmail(email, 'Recuperar contraseña', `Link: ${resetLink}`, html);

    res.json({ isSuccess: true, message: 'Correo enviado con instrucciones' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ isSuccess: false, message: 'Error del servidor' });
  }
};
 

// routes/auth.ts
export const contraseña = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Validar token
    const user = await prisma.user.findFirst({
      where: { resetToken: token },
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña y borrar el token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExp: null,
      },
    });

    return res.json({ message: "Contraseña actualizada correctamente" });

  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};
 

export const usuarios  = async (req, res) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'ID de usuario no válido' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};