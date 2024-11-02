// src/validations/userValidations.mjs
import { z } from 'zod';

export const registerSchema = z.object({
	nombre: z.string().min(1, { message: 'El nombre es obligatorio' }),
	apellido: z.string().min(1, { message: 'El apellido es obligatorio' }),
	email: z.string().email({ message: 'Formato de email inválido' }),
	contrasena: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
	direccion: z.string().min(1, { message: 'La dirección es obligatoria' }),
	telefono: z.string().regex(/^\d{10,15}$/, { message: 'El teléfono debe tener entre 10 y 15 dígitos' }),
	vecindarioId: z.number().int().positive({ message: 'vecindarioId debe ser un número positivo' })
});
