/* eslint-disable camelcase */
/* eslint-disable no-console */
"use strict";
// Importa el modelo de datos 'Role'
import Role from "../models/role.model.js";
import User from "../models/user.model.js";

/**
 * Crea los roles por defecto en la base de datos.
 * @async
 * @function createRoles
 * @returns {Promise<void>}
 */
async function createRoles() {
  try {
    // Busca todos los roles en la base de datos
    const count = await Role.estimatedDocumentCount();
    // Si no hay roles en la base de datos los crea
    if (count > 0) return;

    await Promise.all([
      new Role({ name: "medico" }).save(),
      new Role({ name: "admin_medico" }).save(),
      new Role({ name: "paciente" }).save(),
    ]);
    console.log("* => Roles creados exitosamente");
  } catch (error) {
    console.error(error);
  }
}

/**
 * Crea los usuarios por defecto en la base de datos.
 * @async
 * @function createUsers
 * @returns {Promise<void>}
 */
async function createUsers() {
  try {
    const count = await User.estimatedDocumentCount();
    if (count > 0) return;

    const admin_medico = await Role.findOne({ name: "admin_medico" });
    const medico = await Role.findOne({ name: "medico" });
    const paciente = await Role.findOne({ name: "paciente" });

    await Promise.all([
      new User({
        username: "paciente",
        email: "user@email.com",
        rut: "11111111-1",
        password: await User.encryptPassword("user123"),
        roles: paciente._id,
      }).save(),
      new User({
        username: "medico",
        email: "m@email.com",
        rut: "12345678-0",
        password: await User.encryptPassword("med123"),
        roles: medico._id,
      }).save(),
      new User({
        username: "admin_medico",
        email: "ad@email.com",
        rut: "12345678-1",
        password: await User.encryptPassword("admin123"),
        roles: admin_medico._id,
      }).save(),
    ]);
    console.log("* => Users creados exitosamente");
  } catch (error) {
    console.error(error);
  }
}

export { createRoles, createUsers };
