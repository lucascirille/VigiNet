import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Activar una alarma y notificar a los usuarios del mismo vecindario
export const activarAlarma = async (usuarioId, descripcion, tipo) => {

    const usuario = await prisma.usuario.findUnique({
        where: { usuarioid: usuarioId },
        select: { vecindarioid: true },
    });

    if (!usuario) throw new Error("Usuario no encontrado");


    const alarma = await prisma.alarma.create({
        data: {
            descripcion,
            tipo,
            activo: true,
            usuarioid: usuarioId,
        },
    });


    const usuariosDelVecindario = await prisma.usuario.findMany({
        where: { vecindarioid: usuario.vecindarioid },
        select: { usuarioid: true },
    });

    return { alarma, usuariosDelVecindario };
};

// Obtener todas las alarmas
export const getAllAlarmas = async () => {
    return await prisma.alarma.findMany({
        include: { usuario: true, 
        ubicaciones: true,
        },
    });
};

export const getAllAlarmasByVecindario = async (vecindarioId) => {
    return await prisma.alarma.findMany({
        where: { vecindarioid: vecindarioId },
        include: { usuario: true },
    });
}

// Obtener una alarma por ID
export const getAlarmaById = async (id) => {
    const alarmaId = parseInt(id);
    if (isNaN(alarmaId)) throw new Error("ID de alarma inválido");

    return await prisma.alarma.findUnique({
        where: { alarmaid: alarmaId },
        include: { usuario: true },
    });
};

// Crear una nueva alarma
export const createAlarma = async (data) => {
    const { activo, fechaHora, tipo, usuarioId } = data;

    if (!tipo || !usuarioId) {
        throw new Error("Todos los campos (tipo, usuarioId) son obligatorios");
    }

    return await prisma.alarma.create({
        data: {
            activo: activo !== undefined ? activo : true,
            fechaHora: fechaHora ? new Date(fechaHora) : new Date(),
            tipo,
            usuario: {
                connect: { usuarioId: parseInt(usuarioId) },
            },
        },
    });
};

// Actualizar una alarma existente
export const updateAlarma = async (id, data) => {
    const alarmaId = parseInt(id);
    if (isNaN(alarmaId)) throw new Error("ID de alarma inválido");

    return await prisma.alarma.update({
        where: { alarmaid: alarmaId },
        data: {
            descripcion: data.descripcion,
            activo: data.activo,
            fechaHora: data.fechaHora ? new Date(data.fechaHora) : undefined,
            tipo: data.tipo,
            usuario: data.usuarioId ? { connect: { usuarioid: parseInt(data.usuarioId) } } : undefined,
        },
    });
};

// Eliminar una alarma por ID
export const deleteAlarma = async (id) => {
    const alarmaId = parseInt(id);
    if (isNaN(alarmaId)) throw new Error("ID de alarma inválido");

    return await prisma.alarma.delete({
        where: { alarmaid: alarmaId },
    });
};
