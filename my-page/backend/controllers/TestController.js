import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';


const prisma = new PrismaClient();
const apiResponse = (isSuccess, message, data = null) => ({
  isSuccess,
  message,
  data,
});



export const postRespuestas = async (req, res) => {
  const lista = req.body;

  if (!Array.isArray(lista) || lista.length === 0) {
    return res.status(400).json(apiResponse(false, 'El cuerpo debe ser una lista de objetos'));
  }

  const usuarioTestId = lista[0]?.idUsuarioTest;
  if (!usuarioTestId) {
    return res.status(400).json(apiResponse(false, 'Falta idUsuarioTest'));
  }

  try {
    // 1. Guardar respuestas
    await prisma.respuestasusuariotest.createMany({
      data: lista,
      skipDuplicates: false,
    });

    // 2. Marcar test como completado
    await prisma.usuariotest.update({
      where: { id: usuarioTestId },
      data: { testCompleted: true },
    });

    // 3. Obtener categorías de dicotomía
    const categorias = await prisma.categoriadepreguntas.findMany();

    // 4. Obtener respuestas del usuario con preguntas y respuestas (para puntaje)
    const respuestasConPreguntas = await prisma.respuestasusuariotest.findMany({
      where: { idUsuarioTest: usuarioTestId },
      include: {
        pregunta: true,
        respuesta: true, // incluye el puntaje
      },
    });

    const resultados = [];

    for (const categoria of categorias) {
      const [letra1, letra2] = categoria.nombre.split('/'); // ej: 'E/I'

      const respuestasDeCategoria = respuestasConPreguntas.filter(
        (r) => r.pregunta.categoriaPreguntasId === categoria.id
      );

      let total = 0;

      for (const respuesta of respuestasDeCategoria) {
        const puntaje = respuesta.respuesta.puntaje; // valor de -2 a 2

        // Puntaje positivo favorece letra1, negativo favorece letra2
        total += puntaje;
      }

      const letraElegida = total >= 0 ? letra1 : letra2;
      resultados.push(letraElegida);
    }

    // 5. Determinar tipo MBTI
    const tipoMBTI = resultados.join('');

    // 6. Buscar personalidad por tipo
    const personalidad = await prisma.personalidades.findFirst({
      where: { nombre: tipoMBTI },
    });

    if (!personalidad) {
      return res.status(404).json(apiResponse(false, `Tipo MBTI '${tipoMBTI}' no reconocido`));
    }

    // 7. Guardar resultado final
    await prisma.resultadosdetest.create({
      data: {
        idUsuarioTest: usuarioTestId,
        idDicotomia: personalidad.id,
        isActive: true,
      },
    });

    // 8. Responder con resultado
    return res.json(apiResponse(true, 'Test completado correctamente', {
      tipoMBTI,
      personalidad: personalidad.nombre,
      descripcion: personalidad.descripcion,
      keywords: personalidad.keywords,
    }));
  } catch (error) {
    console.error(error);
    return res.status(500).json(apiResponse(false, 'Error interno del servidor'));
  }
};




export const verificarTest = async (req, res) => {
try {
    const {idUsuario} = req.body;
    // Verifica si ya existe CUALQUIER test creado por el usuario
    const testExistente = await prisma.usuariotest.findFirst({
      where: {
        idUsuario,
      },
    });

    if (testExistente) {
      return res.json({ isSuccess: true, data: { idUsuarioTest: testExistente.id } });
    } else {
      return res.json({ isSuccess: true, data: null });
    }
  } catch (err) {
    console.error("xd",err);
    return res.status(500).json({ isSuccess: false, message: "Error al buscar test." });
  }

}



export const iniciarTest = async (req, res) => {
  const { idUsuario, tipoTestId } = req.body;

  if (typeof idUsuario !== 'number' || typeof tipoTestId !== 'number') {
    return res.status(400).json(apiResponse(false, 'Datos inválidos.'));
  }

  try {
    // Verifica si ya existe CUALQUIER test creado por el usuario
    const testExistente = await prisma.usuariotest.findFirst({
    where: {
  idUsuario,
  isActive: true,
  testCompleted: false,
}
    });

    if (testExistente) {
      return res
        .status(409)
        .json(apiResponse(false, 'Ya tienes un test creado. No puedes crear otro.'));
    }

    // Si no tiene ningún test, se crea uno nuevo
    const nuevoTest = await prisma.usuariotest.create({
      data: {
        idUsuario,
        tipoTestId,
        isActive: true,
        codigo: `TEST-${uuidv4()}`,
      },
    });

    return res.json(
      apiResponse(true, 'Test iniciado.', {
        idUsuarioTest: nuevoTest.id,
      })
    );
  } catch (error) {
    console.error('Error al iniciar test:', error);
    return res
      .status(500)
      .json(apiResponse(false, 'Error interno al iniciar el test.'));
  }
};

// export const iniciarTest = async (req, res) => {
//   const { idUsuario, tipoTestId } = req.body;

//   // Validación de datos
//   if (typeof idUsuario !== 'number' || typeof tipoTestId !== 'number') {
//     return res.status(400).json(apiResponse(false, 'Datos inválidos.'));
//   }

//   try {
//     // Verificar si ya existe un test activo para este usuario y tipo de test
//     const testExistente = await prisma.usuariotest.findFirst({
//       where: {
//         idUsuario,
//         tipoTestId,
//         isActive: true,
//       },
//     });

//     if (testExistente) {
//       return res
//         .status(409)
//         .json(apiResponse(false, 'Ya tienes un test activo de este tipo.'));
//     }

//     // Crear un nuevo test
//     const nuevoTest = await prisma.usuariotest.create({
//       data: {
//         idUsuario,
//         tipoTestId,
//         isActive: true,
//         codigo: `TEST-${uuidv4()}`,
//       },
//     });

//     return res.json(
//       apiResponse(true, 'Test iniciado.', {
//         idUsuarioTest: nuevoTest.id,
//       })
//     );
//   } catch (error) {
//     console.error('Error al iniciar test:', error);
//     return res
//       .status(500)
//       .json(apiResponse(false, 'Error interno al iniciar el test.'));
//   }
// }


export const obtenerTestsCompletados = async (req, res) => {
  try {
    const { idUsuario, personalidad, desde, hasta, nombre } = req.query;

    const filtros = {
      isActive: true,
      ...(idUsuario && {
        usuariotest: {
          idUsuario: Number(idUsuario),
        },
      }),
      ...(personalidad && {
        personalidades: {
          nombre: {
            contains: personalidad,
          },
        },
      }),
      ...(desde || hasta
        ? {
            createdAt: {
              ...(desde ? { gte: new Date(desde) } : {}),
              ...(hasta
                ? {
                    lte: new Date(
                      new Date(hasta).setHours(23, 59, 59, 999)
                    ),
                  }
                : {}),
            },
          }
        : {}),
      ...(nombre && {
        usuariotest: {
          user: {
            name: {
              contains: nombre,
            },
          },
        },
      }),
    };

    const resultados = await prisma.resultadosdetest.findMany({
      where: filtros,
      include: {
        personalidades: true,
        usuariotest: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                roleId: true,
                isActive: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json({
      isSuccess: true,
      message: 'Tests obtenidos correctamente',
      data: resultados,
    });
  } catch (error) {
    console.error('Error al obtener tests completados:', error);
    return res.status(500).json({
      isSuccess: false,
      message: 'Error del servidor',
    });
  }
};





export const getTestPersonality = async (req, res) => {
  try {
    const test = await prisma.pregunta.findMany({
      where: {
        categoriadepreguntas: {
          tipoTestId: 1,
        },
      },
      include: {
        categoriadepreguntas: true,
      },
    });

    const data = test.map(u => ({
      id: u.id,
      pregunta: u.pregunta,
      categoriaPreguntasId: u.categoriaPreguntasId,
      categoria: u.categoriadepreguntas.nombre,
      ordenCategoria: u.categoriadepreguntas.orden,
      tipoTestId: u.categoriadepreguntas.tipoTestId,
    }));

    res.json(apiResponse(true, 'Preguntas de tipo test obtenidas correctamente', data));
  } catch (error) {
    console.error(error);
    res.status(500).json(apiResponse(false, 'Error al obtener preguntas de tipo test'));
  }
};

export const getRespuestasActivas = async (req, res) => {
  try {
    const respuestas = await prisma.respuesta.findMany({
      where: { isActive: true },
      orderBy: { puntaje: 'desc' },
    });

    res.json(apiResponse(true, 'Respuestas activas obtenidas correctamente', respuestas));
  } catch (error) {
    console.error(error);
    res.status(500).json(apiResponse(false, 'Error al obtener respuestas'));
  }
};

export const guardarRespuestas = async (req, res) => {
  const { idUsuarioTest, respuestas, resultado } = req.body;

  if (!idUsuarioTest || !Array.isArray(respuestas)) {
    return res.status(400).json(apiResponse(false, 'Datos incompletos o inválidos'));
  }

  try {
    for (const r of respuestas) {
      // Busca la categoría de la pregunta antes de guardar
      const pregunta = await prisma.pregunta.findUnique({
        where: { id: r.idPregunta },
        select: { categoriaPreguntasId: true },
      });

      if (!pregunta) {
        return res.status(400).json(apiResponse(false, `Pregunta con ID ${r.idPregunta} no encontrada`));
      }

      await prisma.respuestasusuariotest.create({
        data: {
          idUsuarioTest,
          idPregunta: r.idPregunta,
          idRespuesta: r.idRespuesta,
          idCategoria: pregunta.categoriaPreguntasId, // ← campo requerido
        },
      });
    }

    // Guarda el resultado del test, si viene
    if (resultado) {
      await prisma.resultadosdetest.create({
        data: {
          idUsuarioTest,
          idDicotomia: resultado, // ← asegúrate de que este ID existe en `personalidades`
        },
      });
    }

    return res.json(apiResponse(true, 'Respuestas guardadas correctamente'));
  } catch (error) {
    console.error(error);
    return res.status(500).json(apiResponse(false, 'Error al guardar respuestas'));
  }
};


export const getDashboardResumen = async (req, res) => {
  try {
    const ahora = new Date();
    const hace7Dias = new Date();
    hace7Dias.setDate(ahora.getDate() - 7);

    // Nuevos usuarios esta semana
    const nuevosUsuarios = await prisma.user.count({
      where: {
        createdAt: {
          gte: hace7Dias,
          lte: ahora,
        },
        isActive: true,
      },
    });

    // Tests completados esta semana
    const testsCompletados = await prisma.resultadosdetest.count({
      where: {
        createdAt: {
          gte: hace7Dias,
          lte: ahora,
        },
        isActive: true,
      },
    });

    // Reportes pendientes (suponiendo una tabla "reportes")
    // const reportesPendientes = await prisma.usuariotest.count({
    //   where: {
    //     testCompleted: true,
    //   },
    // });

    const reportesPendientes = await prisma.usuariotest.count({
  where: {
    testCompleted: true,
    user: {
      role: {
        name: "Postulante",
      },
    },
  },
});

    // Agrupar resultados MBTI de la semana por tipo
    const resultadosMBTI = await prisma.resultadosdetest.groupBy({
      by: ["idDicotomia"],
      where: {
        createdAt: {
          gte: hace7Dias,
          lte: ahora,
        },
        isActive: true,
      },
      _count: {
        id: true,
      },
    });

    // Obtener nombres de personalidades
    const nombresPersonalidades = await prisma.personalidades.findMany({
      select: {
        id: true,
        nombre: true,
      },
    });

    const resultadosPorPersonalidad = resultadosMBTI.map((r) => {
      const nombre = nombresPersonalidades.find((p) => p.id === r.idDicotomia)?.nombre || "N/A";
      return {
        tipo: nombre,
        cantidad: r._count.id,
      };
    });

    res.json({
      isSuccess: true,
      message: "Resumen de dashboard generado correctamente",
      data: {
        nuevosUsuarios,
        testsCompletados,
        reportesPendientes,
        resultadosMBTI: resultadosPorPersonalidad,
      },
    });
  } catch (error) {
    console.error("Error al cargar dashboard:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Error interno del servidor",
    });
  }
};

export const eliminarTestNoCompletado = async (req, res) => {
  const { idUsuario } = req.body;

  if (typeof idUsuario !== 'number') {
    return res.status(400).json(apiResponse(false, 'ID de usuario inválido.'));
  }

  try {
    // Borra los tests asociados al usuario (frontend valida si debe eliminarse o no)
    const deleted = await prisma.usuariotest.deleteMany({
      where: {
        idUsuario,
      },
    });

    return res.json(apiResponse(true, 'Test eliminado correctamente.', { count: deleted.count }));
  } catch (error) {
    console.error('Error al eliminar test:', error);
    return res.status(500).json(apiResponse(false, 'Error al eliminar el test.'));
  }
};


export const obtenerUsuariosConTest = async (req, res) => {
  try {
    const usuariosConTest = await prisma.user.findMany({
      where: {
        usuariotest: {
          some: {}, // Esto filtra usuarios que tengan al menos un test
        },
      },
      include: {
        usuariotest: true, // Opcional: incluye los tests realizados
      },
    });

    return res.json(apiResponse(true, 'Usuarios que han hecho el test obtenidos correctamente', usuariosConTest));
  } catch (error) {
    console.error(error);
    return res.status(500).json(apiResponse(false, 'Error al obtener usuarios con test'));
  }
};


export const verificarTestCompletado = async (req, res) => {
  try {
    const { idUsuario } = req.params;

    if (!idUsuario) {
      return res.status(400).json(apiResponse(false, 'Falta idUsuario.'));
    }

    const testCompletado = await prisma.usuariotest.findFirst({
      where: {
        idUsuario: Number(idUsuario),
        testCompleted: true,
      },
    });

    if (testCompletado) {
      return res.json(apiResponse(true, 'El usuario ya completó el test.', true));
    } else {
      return res.json(apiResponse(true, 'El usuario no ha completado el test.', false));
    }
  } catch (error) {
    console.error("Error al verificar estado completo del test:", error);
    return res.status(500).json(apiResponse(false, 'Error del servidor'));
  }
};
