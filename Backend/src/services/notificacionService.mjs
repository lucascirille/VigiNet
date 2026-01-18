import { PrismaClient } from '@prisma/client';
import { io } from '../../init.mjs';

const prisma = new PrismaClient();

export const getAllNotificaciones = async () => {
    return await prisma.notificacion.findMany();
};

export const getNotificacionById = async (id) => {
    return await prisma.notificacion.findUnique({
        where: { notificacionId: parseInt(id) },
    });
};

export const createNotificacion = async (data) => {
    const { titulo, notificacion, contenido, tipo, usuarioId } = data;

    
    if (!titulo || !notificacion || !contenido || !tipo || !usuarioId) {
        throw new Error('Todos los campos (titulo, notificacion, contenido, tipo, fechaHora, usuarioId) son obligatorios');
    }

    
    const usuario = await prisma.usuario.findUnique({
        where: { usuarioId: parseInt(usuarioId) },
        select: { vecindarioId: true, nombre: true, apellido: true }
    });

    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }

    
    const nuevaNotificacion = await prisma.notificacion.create({
        data: {
            titulo,
            notificacion,
            contenido,
            tipo,
            usuarioId: parseInt(usuarioId),
        },
        include: {
            usuario: {
                select: { nombre: true, apellido: true }
            }
        }
    });

    
    if (tipo !== 'alarma') {
        const notificacionSocket = {
            mensaje: contenido,
            tipo: tipo,
            emisor: `${usuario.nombre} ${usuario.apellido}`,
            timestamp: new Date().toISOString(),
            vecindarioId: usuario.vecindarioId,
            titulo: titulo
        };

        
        io.to(`vecindario_${usuario.vecindarioId}`).emit('notificacion', notificacionSocket);
        
        console.log(` Notificación enviada al vecindario ${usuario.vecindarioId}: ${titulo}`);
    }

    return nuevaNotificacion;
};

export const updateNotificacion = async (id, data) => {
    return await prisma.notificacion.update({
        where: { notificacionId: parseInt(id) },
        data,
    });
};

export const deleteNotificacion = async (id) => {
    return await prisma.notificacion.delete({
        where: { notificacionId: parseInt(id) },
    });
};
