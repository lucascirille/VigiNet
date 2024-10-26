// src/services/usuarioService.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUsuarios = async () => {
    return await prisma.usuario.findMany();
};

export const getUsuarioById = async (id) => {
    return await prisma.usuario.findUnique({
        where: { usuarioId: parseInt(id) },
    });
};

export const createUsuario = async (data) => {
    const { nombre, email, apellido, contrasena, direccion, telefono, vecindarioId } = data;

    // Validación de datos
    if (!nombre || !email || !apellido || !contrasena || !direccion || !telefono || !vecindarioId) {
        throw new Error('Todos los campos (nombre, email, apellido, contrasena, direccion, telefono, vecindarioId) son obligatorios');
    }

    // Crear el usuario
    return await prisma.usuario.create({
        data: {
            nombre,
            email,
            apellido,
            contrasena,
            direccion,
            telefono,
            vecindarioId: parseInt(vecindarioId),
        },
    });
};

export const updateUsuario = async (id, data) => {
    return await prisma.usuario.update({
        where: { usuarioId: parseInt(id) },
        data,
    });
};

export const deleteUsuario = async (id) => {
    return await prisma.usuario.delete({
        where: { usuarioId: parseInt(id) },
    });
};
