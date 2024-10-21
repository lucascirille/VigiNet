const {  PrismaClient } = require ('@prisma/client');
const prisma = new PrismaClient();

const crearUsuario = async (req,res) =>{
    const {nombre , apellido, email, password, telefono, direccion, vecindario} = req.body;
    try{        
        const nuevoUsuario = await prisma.usuario.create({
            nombre, apellido, email, password, telefono, direccion, vecindario,})
            res.status(201).json(nuevoUsuario)

 } 
 catch(error)
 {
    res.status(500).json({ error : 'Error al crear el usuario'})
 }

 }


const obtenerUsuario = async (req, res) => {

    try{
        const usuarios = await prisma.usuario.findMany()
        res.json(usuarios)
    }catch(error){
        res.status(500).json({error: 'Error al obtener los usuarios'})

    }
}

const obtenerUsuarioId = async (req, res) => {
    const { id } = req.params;
  
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { usuarioId: Number(usuarioId) }
      })
      if (usuario) {
        res.json(usuario);
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' })
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el usuario' })
    }
  }


  const actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, email, telefono, direccion, vecindario } = req.body;
  
    try {
      const usuarioActualizado = await prisma.usuario.update({
        where: { usuarioId: Number(usuarioId) },
        data: { nombre, apellido, email, telefono, direccion, vecindario },
      });
      res.json(usuarioActualizado);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
  };

  const eliminarUsuario = async (req, res) => {
    const { id } = req.params;
  
    try {
      await prisma.usuario.delete({
        where: { usuarioId: Number(usuarioId) },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
  };

  
module.exports = { crearUsuario,obtenerUsuario, obtenerUsuarioId, actualizarUsuario, eliminarUsuario}