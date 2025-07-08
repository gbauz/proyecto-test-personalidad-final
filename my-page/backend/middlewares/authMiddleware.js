import jwt from 'jsonwebtoken';

const SECRET_KEY = 'tu_clave_secreta'; // pásalo a env luego

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error)
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

export default verifyToken;
