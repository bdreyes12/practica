/* eslint-disable max-len */
"use strict";
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";

/** Controlador de usuarios */
import usuarioController from "../controllers/user.controller.js";

/** Middlewares de autorización */
const authorizationMiddleware = requiere("../middlewares/authorization.middleware.js");

/** Middleware de autenticación */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

/** Instancia del enrutador */
const router = Router();

// Define el middleware de autenticación para todas las rutas
// router.use(authenticationMiddleware);

// Define el middleware de autorización para rutas que lo requieran
router.get("/", authenticationMiddleware, authorizationMiddleware.isAdmin, usuarioController.getUsers);
router.put("/:id", authenticationMiddleware, authorizationMiddleware.isAdmin, usuarioController.updateUser);
router.delete("/:id", authenticationMiddleware, authorizationMiddleware.isAdmin, usuarioController.deleteUser);

// Define las rutas para los usuarios
router.post("/", usuarioController.createUser);
router.get("/:id", authenticationMiddleware, usuarioController.getUserById);


// Exporta el enrutador
export default router;
