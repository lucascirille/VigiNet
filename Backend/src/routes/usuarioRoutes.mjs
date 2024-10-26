// src/routes/usuarioRoutes.mjs
import express from 'express';
import * as usuarioController from '../controllers/usuarioController.mjs';

const router = express.Router();

router
	.route('/')
	.get(usuarioController.getAllUsuarios)
	.post(usuarioController.createUsuario);

router
	.route('/:id')
	.get(usuarioController.getUsuarioById)
	.put(usuarioController.updateUsuario)
	.delete(usuarioController.deleteUsuario);

export default router;
