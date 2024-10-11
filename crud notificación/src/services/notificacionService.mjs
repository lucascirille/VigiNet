// src/services/notificacionService.mjs
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllNotificaciones = async () => {
    return await prisma.notificacion.findMany();
};

export const getNotificacionById = async (id) => {
    return await prisma.notificacion.findUnique({
        where: { id_Notificacion: Number(id) },
    });
};

export const createNotificacion = async (data) => {
    return await prisma.notificacion.create({
        data: {
            Contenido: data.Contenido,
            Fecha_Hora: new Date(data.Fecha_Hora),  // Asegúrate de que el formato de fecha sea correcto
            Tipo: data.Tipo,
        },
    });
};

export const updateNotificacion = async (id, data) => {
    return await prisma.notificacion.update({
        where: { id_Notificacion: Number(id) },
        data: {
            Contenido: data.Contenido,
            Fecha_Hora: new Date(data.Fecha_Hora),
            Tipo: data.Tipo,
        },
    });
};

export const deleteNotificacion = async (id) => {
    return await prisma.notificacion.delete({
        where: { id_Notificacion: Number(id) },
    });
};
