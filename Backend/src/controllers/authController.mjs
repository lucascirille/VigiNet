import * as authService from "../services/authService.mjs";
import catchAsync from "../helpers/catchAsync.mjs";

export const login = catchAsync(async (req, res) => {
  console.log("🔐 Login attempt received:", { email: req.body.email });
  
  try {
    const { email, contrasena } = req.body;


    if (!email || !contrasena) {
      console.log("Missing required fields:", { email: !!email, contrasena: !!contrasena });
      return res.status(400).json({
        message: "Email y contraseña son requeridos",
      });
    }

    console.log("📧 Attempting login for email:", email);

  
    const loginData = await authService.loginUser({ email, contrasena });

    console.log("Login successful for user:", email);

   
    res.status(200).json({
      message: "Autenticación exitosa",
      token: loginData.token,
      user: loginData.user,
    });
  } catch (error) {
    console.error("Login error:", error);
    
   
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }
    
    if (error.message === 'Credenciales incorrectas') {
      return res.status(401).json({
        message: "Credenciales incorrectas",
      });
    }

    
    res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
});

export const validateToken = catchAsync(async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Token es requerido",
      });
    }

 
    const usuarioId = await authService.validateToken(token);

   
    res.status(200).json({
      message: "Token válido",
      usuarioId,
    });
  } catch (error) {
    console.error("Token validation error:", error);
    
    if (error.message === 'Token inválido o expirado') {
      return res.status(401).json({
        message: "Token inválido o expirado",
      });
    }

    res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
});