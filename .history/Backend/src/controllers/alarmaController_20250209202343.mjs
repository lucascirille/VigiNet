// src/controllers/alarmaController.mjs
import * as alarmaService from "../services/alarmaService.mjs";

import catchAsync from "../helpers/catchAsync.mjs";

export const getAllAlarmas = catchAsync(async (req, res) => {
  const alarmas = await alarmaService.getAllAlarmas();
  res.status(200).json(alarmas);
});

export const getAlarmaById = catchAsync(async (req, res) => {
  const alarma = await alarmaService.getAlarmaById(req.params.id);
  if (!alarma) return res.status(404).json({ message: "Alarma no encontrada" });
  res.status(200).json(alarma);
});

export const createAlarma = catchAsync(async (req, res) => {
  const alarma = await alarmaService.createAlarma(req.body);
  res.status(201).json(alarma);
});

export const updateAlarma = catchAsync(async (req, res) => {
  const alarma = await alarmaService.updateAlarma(req.params.id, req.body);
  res.status(200).json(alarma);
});

export const deleteAlarma = catchAsync(async (req, res) => {
  const alarmaExistente = await alarmaService.getAlarmaById(req.params.id);
  if (!alarmaExistente)
    return res.status(404).json({ message: "Alarma no encontrada" });

  await alarmaService.deleteAlarma(req.params.id);
  res.status(204).json({ message: "Alarma eliminada" });
});

export const agregarAlarma = async (req, res) => {
  try {
    const { vecindarioId, tipo, descripcion, usuarioId } = req.body;
    const alarma = await alarmsService.agregarAlarma(vecindarioId, tipo, descripcion, usuarioId);
    res.status(201).json(alarma);
  } catch (error) {
    console.error("Error al agregar la alarma:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = { agregarAlarma };