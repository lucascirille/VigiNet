import prisma from '../db/prismaClient.mjs';


const transformarAlarmaAHistorial = (alarma) => {
  if (!alarma) {
    return null;
  }
  return {
    alarmaId: alarma.alarmaId,
    tipo: alarma.tipo,
    descripcion: alarma.descripcion,
    fechaHora: alarma.fechaHora,
    activo: alarma.activo,
    ubicaciones: alarma.ubicaciones,
    usuario: alarma.usuario,
    emisor: alarma.usuario ? `${alarma.usuario.nombre} ${alarma.usuario.apellido}` : 'Desconocido',
  };
};

export const obtenerHistorial = async (vecindarioId, limit = 50, offset = 0) => {
  try {
    const alarmas = await prisma.alarma.findMany({
      where: { usuario: { vecindarioId: parseInt(vecindarioId) } },
      include: {
        usuario: {
          select: {
            nombre: true,
            apellido: true,
            vecindarioId: true,
          },
        },
        ubicaciones: true,
      },
      orderBy: { fechaHora: 'desc' },
      take: limit,
      skip: offset,
    });
    return alarmas.map(transformarAlarmaAHistorial).filter(Boolean);
  } catch (error) {
    console.error('Error obteniendo historial desde alarmas:', error);
    throw error;
  }
};


export const obtenerHistorialPorTipo = async (vecindarioId, tipo, limit = 50) => {
  try {
    const alarmas = await prisma.alarma.findMany({
      where: {
        tipo: tipo,
        usuario: { vecindarioId: parseInt(vecindarioId) },
      },
      include: {
        usuario: {
          select: {
            nombre: true,
            apellido: true,
            vecindario: { select: { nombre: true } },
          },
        },
      },
      orderBy: { fechaHora: 'desc' },
      take: limit,
    });
    return alarmas.map(transformarAlarmaAHistorial).filter(Boolean);
  } catch (error) {
    console.error('Error obteniendo historial por tipo desde alarmas:', error);
    throw error;
  }
};


export const obtenerNotificacionesRecientes = async (vecindarioId, limit = 10) => {
  try {
    const alarmas = await prisma.alarma.findMany({
      where: {
        usuario: { vecindarioId: parseInt(vecindarioId) },
      },
      include: {
        usuario: {
          select: {
            nombre: true,
            apellido: true,
            vecindarioId: true,
          },
        },
        ubicaciones: true,
      },
      orderBy: { fechaHora: 'desc' },
      take: limit,
    });
    return alarmas.map(transformarAlarmaAHistorial).filter(Boolean);
  } catch (error) {
    console.error('Error obteniendo notificaciones recientes desde alarmas:', error);
    throw error;
  }
};

export const buscarNotificaciones = async (vecindarioId, texto, limit = 20) => {
  try {
    const alarmas = await prisma.alarma.findMany({
      where: {
        usuario: {
          vecindarioId: parseInt(vecindarioId),
        },
        OR: [
          { tipo: { contains: texto, mode: 'insensitive' } },
          {
            usuario: {
              OR: [
                { nombre: { contains: texto, mode: 'insensitive' } },
                { apellido: { contains: texto, mode: 'insensitive' } },
              ],
            },
          },
        ],
      },
      include: {
        usuario: {
          select: {
            nombre: true,
            apellido: true,
            vecindario: { select: { nombre: true } },
          },
        },
      },
      orderBy: { fechaHora: 'desc' },
      take: limit,
    });
    return alarmas.map(transformarAlarmaAHistorial).filter(Boolean);
  } catch (error) {
    console.error('Error buscando notificaciones (alarmas):', error);
    throw error;
  }
};

export const agregarNotificacionesPrueba = async (vecindarioId) => {
  try {
    const unUsuario = await prisma.usuario.findFirst({
      where: { vecindarioId: parseInt(vecindarioId) },
    });

    if (!unUsuario) {
      console.log(`No se encontraron usuarios en el vecindario ${vecindarioId} para crear alarmas de prueba.`);
      return;
    }

    const alarmasPrueba = [
      { tipo: 'panico', usuarioId: unUsuario.usuarioId },
      { tipo: 'incendio', usuarioId: unUsuario.usuarioId },
      { tipo: 'medica', usuarioId: unUsuario.usuarioId },
    ];

    await prisma.alarma.createMany({
      data: alarmasPrueba,
      skipDuplicates: true,
    });

    console.log(`Alarmas de prueba agregadas al usuario ${unUsuario.usuarioId} del vecindario ${vecindarioId}`);
  } catch (error) {
    console.error('Error agregando alarmas de prueba:', error);
    throw error;
  }
};