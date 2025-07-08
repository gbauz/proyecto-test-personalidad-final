import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const apiResponse = (isSuccess, message, data = null) => ({ isSuccess, message, data });

export class OfertaController {
  static async crearOferta(req, res) {
    const { nombre, descripcion, sueldo, modalidad, creadorId } = req.body;

    if (!creadorId) {
      return res.status(400).json(apiResponse(false, 'Falta el ID del creador'));
    }

    try {
      // Puedes descomentar para validar rol:
      // const creador = await prisma.user.findUnique({ where: { id: creadorId } });
      // const RH_ROLE_ID = 2;
      // if (!creador || creador.roleId !== RH_ROLE_ID) {
      //   return res.status(403).json(apiResponse(false, 'Solo Recursos Humanos puede crear ofertas'));
      // }

      const nuevaOferta = await prisma.oferta.create({
        data: {
          nombre,
          descripcion,
          sueldo: parseFloat(sueldo),
          modalidad,
          creadorId,
          creadoEn: new Date().toISOString(),
        },
      });

      res.status(201).json(apiResponse(true, 'Oferta creada exitosamente', nuevaOferta));
    } catch (error) {
      console.error(error);
      res.status(500).json(apiResponse(false, 'Error al crear la oferta'));
    }
  }

static async obtenerOfertasParaPostulantes(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json(apiResponse(false, 'Falta el ID del usuario'));
  }

  try {
    const usuario = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { roleId: true },
    });

    if (!usuario) {
      return res.status(404).json(apiResponse(false, 'Usuario no encontrado'));
    }

    const ROLE_POSTULANTE = 2;
    if (usuario.roleId === ROLE_POSTULANTE) {
      const testRealizado = await prisma.usuariotest.findFirst({
        where: { idUsuario: Number(userId) },
      });
      if (!testRealizado) {
        return res
          .status(403)
          .json(apiResponse(false, 'Debes completar el test antes de ver ofertas'));
      }
    }

    // <-- Aquí está el cambio: incluimos 'postulaciones' con postulante y fotoPerfil
    const ofertas = await prisma.oferta.findMany({
      include: {
        postulaciones: {
          include: {
            postulante: {
              select: {
                id: true,
                name: true,
                perfil: { select: { fotoPerfil: true } },
              },
            },
          },
        },
      },
      orderBy: { creadoEn: 'desc' },
    });

    return res.json(apiResponse(true, 'Ofertas obtenidas', ofertas));
  } catch (error) {
    console.error(error);
    return res.status(500).json(apiResponse(false, 'Error al obtener ofertas'));
  }
}


  static async postularAOferta(req, res) {
  const { ofertaId, postulanteId } = req.body;

  if (!ofertaId || !postulanteId) {
    return res.status(400).json(apiResponse(false, "Faltan datos"));
  }

  try {
    // Verifica si ya está postulado
    const existe = await prisma.postulacion.findFirst({
      where: {
        ofertaId: Number(ofertaId),
        postulanteId: Number(postulanteId),
      },
    });

    if (existe) {
      return res.status(400).json(apiResponse(false, "Ya te postulaste a esta oferta"));
    }

    const postulacion = await prisma.postulacion.create({
      data: {
        ofertaId: Number(ofertaId),
        postulanteId: Number(postulanteId),
      },
      include: {
        oferta: { select: { nombre: true } },
        postulante: { select: { name: true } },
      },
    });
    console.log(postulacion);

    res.json(apiResponse(true, "Postulación registrada correctamente", postulacion));
  } catch (error) {
    console.error(error);
    res.status(500).json(apiResponse(false, "Error al registrar la postulación"));
  }
}
static async verificarPostulacion(req, res) {
  const { postulanteId } = req.query;

  if (!postulanteId) {
    return res.status(400).json({ isSuccess: false, message: "Falta el ID del postulante" });
  }

  try {
    const existe = await prisma.postulacion.findFirst({
      where: { postulanteId: Number(postulanteId) },
    });

    res.json({
      isSuccess: true,
      yaPostulado: !!existe,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ isSuccess: false, message: "Error verificando postulación" });
  }
}
static async getFechasConUsuario (req, res)  {
  const userId = parseInt(req.params.userId);

  try {
    const fechas = await prisma.postulacion.findMany({
      where: {
        postulanteId: userId,
      },
      select: {
        fecha: true,
        createdAt: true,
        fechaValidacion: true,
         fechaAprobacion: true,
        estadoAprobacion: true,
        postulante: {
          select: { id: true, name: true },
        },
      },
    });

    res.json({ success: true, data: fechas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener fechas" });
  }


}

static async validarDocumento(req, res) {
  const postulanteId = Number(req.params.id);

  try {
    const resultado = await prisma.postulacion.updateMany({
      where: { postulanteId },
      data: { fechaValidacion: new Date() },
    });

    if (resultado.count === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró ninguna postulación para validar',
      });
    }

    res.json({
      success: true,
      message: `Se validaron ${resultado.count} documentos correctamente`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al validar documentos',
    });
  }
}




static async aprobarSolicitud(req, res) {
  const postulanteId = Number(req.params.id);
  const { estadoAprobacion } = req.body; // <- Espera "ACEPTADA" o "RECHAZADA"

  if (!["ACEPTADA", "RECHAZADA"].includes(estadoAprobacion)) {
    return res.status(400).json({
      success: false,
      message: "Estado de aprobación no válido",
    });
  }

  try {
    const resultado = await prisma.postulacion.updateMany({
      where: { postulanteId },
      data: {
        fechaAprobacion: new Date(),
        estadoAprobacion: estadoAprobacion,
      },
    });

    if (resultado.count === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontró postulación para aprobar",
      });
    }

    res.json({
      success: true,
      message: `Se actualizó correctamente con estado "${estadoAprobacion}"`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar estado de aprobación",
    });
  }
}

}