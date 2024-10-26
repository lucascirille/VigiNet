// src/services/alarmaService.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllAlarmas = async () => {
    return await prisma.alarma.findMany({
        include: { usuario: true }, 
    });
};

export const getAlarmaById = async (id) => {
    const alarmaId = parseInt(id);
    if (isNaN(alarmaId)) throw new Error('ID de alarma inválido');

    return await prisma.alarma.findUnique({
        where: { alarmaId },
        include: { usuario: true }, 
    });
};

export const createAlarma = async (data) => {
    const { descripcion, activo, fechaHora, tipo, usuarioId } = data;

    // Validación de datos
    if (!descripcion || !tipo || !usuarioId) {
        throw new Error('Todos los campos (descripcion, tipo, usuarioId) son obligatorios');
    }

    // Crear la alarma
    return await prisma.alarma.create({
        data: {
            descripcion,
            activo: activo !== undefined ? activo : true,
            fechaHora: fechaHora ? new Date(fechaHora) : undefined,
            tipo,
            usuario: {
                connect: { usuarioId: parseInt(usuarioId) }, 
            },
        },
    });
};

export const updateAlarma = async (id, data) => {
    const alarmaId = parseInt(id);
    if (isNaN(alarmaId)) throw new Error('ID de alarma inválido');

    return await prisma.alarma.update({
        where: { alarmaId },
        data: {
            descripcion: data.descripcion,
            activo: data.activo,
            fechaHora: data.fechaHora ? new Date(data.fechaHora) : undefined,
            tipo: data.tipo,
            usuario: data.usuarioId ? { connect: { usuarioId: parseInt(data.usuarioId) } } : undefined,
        },
    });
};

export const deleteAlarma = async (id) => {
    const alarmaId = parseInt(id);
    if (isNaN(alarmaId)) throw new Error('ID de alarma inválido');

    return await prisma.alarma.delete({
        where: { alarmaId },
    });
};
