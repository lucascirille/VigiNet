// src/routes/usuarioRoutes.mjs
import express from 'express';
import * as usuarioController from '../controllers/usuarioController.mjs';
import { authenticateToken } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router
	.route('/')
	.post(usuarioController.createUsuario);

router.use(authenticateToken);

router
	.route('/')
	.get(usuarioController.getAllUsuarios);

router.get('/me', usuarioController.getUsuarioActual);

router
	.route('/:id')
	.get(usuarioController.getUsuarioById)
	.put(usuarioController.updateUsuario)
	.delete(usuarioController.deleteUsuario);

export default router;
