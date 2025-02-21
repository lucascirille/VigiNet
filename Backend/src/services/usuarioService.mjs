// src/services/usuarioService.mjs
import { prismaclient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { registerschema } from '../validations/uservalidations.mjs';

const prisma = new prismaclient();

export const getallusuarios = async () => {
    return await prisma.usuario.findmany();
};

export const getusuariobyid = async (id) => {
    return await prisma.usuario.findunique({
        where: { usuarioid: parseint(id) },
    });
};


export const getusuariobyemail = async (email) => {
    return await prisma.usuario.findunique({
        where: { email },
    });
};

export const createusuario = async (data) => {
    // validación de datos con zod
    registerschema.parse(data);

    const { nombre, email, apellido, contrasena, direccion, telefono, vecindarioid, calle1, calle2, depto, piso } = data;
    // const { nombre, email, apellido, contrasena, direccion, telefono, vecindarioid } = data; #aca agregue calle1, calle2, depto, piso

    // verificación de existencia de email
    const existinguser = await prisma.usuario.findunique({ where: { email } });
    if (existinguser) {
        throw new error('el email ya está en uso');
    }

    // encriptación de la contraseña
    const hashedpassword = await bcrypt.hash(contrasena, 10);

    // creación del usuario
    return await prisma.usuario.create({
        data: {
            nombre,
            apellido,
            email,
            contrasena: hashedpassword,
            direccion,
            telefono,
            vecindarioid: parseint(vecindarioid),
            calle1,
            calle2,
            depto,
            piso,
        },
    });
};

export const updateusuario = async (id, data) => {
    // validación de datos con zod (si es necesario)
    registerschema.partial().parse(data);  // permite campos parciales para la actualización

    if (data.contrasena) {
        data.contrasena = await bcrypt.hash(data.contrasena, 10);  // encripta la nueva contraseña si se incluye
    }

    return await prisma.usuario.update({
        where: { usuarioid: parseint(id) },
        data,
    });
};

export const deleteusuario = async (id) => {
    return await prisma.usuario.delete({
        where: { usuarioid: parseint(id) },
    });
};
