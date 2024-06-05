/* eslint-disable require-jsdoc */
/* eslint-disable prefer-const */
/* eslint-disable space-before-blocks */
/* eslint-disable max-len */
"use strict";

const { respondSuccess, respondError } = require("../utils/resHandler");
const RecervaService = require("../services/recerva.service");
const { recervaBodySchema, recervaIdSchema } = require("../schema/recerva.schema");
const { handleError } = require("../utils/errorHandler");

/**
 * @description Función para obtener todas las recervas
 * @param {Object} req Request object - Petición del cliente
 * @param {Object} res Response object - Respuesta del servidor
 */
async function getRecervas(req, res) {
    try {
        const [recervas, errorRecervas] = await RecervaService.getRecervas();
        if (errorRecervas) return respondError(req, res, 404, errorRecervas);
        recervas.leght === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, ["Las Recerbas Hechas Son Las Siguientes: ", reservas]);
    } catch (error) {
        respondError(req, res, 400, error.message);
    }
}

/**
 * @description Función para obtener una recerva por su id
 * @param {Object} req Request object - Petición del cliente
 * @param {Object} res Response object - Respuesta del servidor
 * /recerva/:id
 */
async function getRecervaById(req, res) {
    try {
        const { params } = req;
        const { error: paramsError } = recervaIdSchema.validate(params.id);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const [recerva, errorRecerva] = await RecervaService.getRecervaById(params.id);

        if (errorRecerva) return respondError(req, res, 404, errorRecerva);
        respondSuccess(req, res, 200, ["La Recerva Solicitada Es La Siguiente: ", recerva]);
    } catch (error) {
        handleError(error, "recerva.controllers -> getRecervaById");
        respondError(req, res, 400, "No se pudo obtener la recerva solicitada");
    }
} 

/**
 * @description Función para crear una recerva
 * @param {Object} req Request object - Petición del cliente
 * @param {Object} res Response object - Respuesta del servidor
 */
async function createRecerva(req, res) {
    try {
        const aux = new Date();
        const fechaActual = aux.toLocaleDateString();
        const { body } = req;
        const fechaInput = body.fecha;
        
        let fecha1 = fechaActual.split("-");
        let fecha2 = fechaInput.split("/");

        if (fecha1[2] > fecha2[2]) return respondError(req, res, 400, "La fecha de la recerva debe ser posterior a la fecha actual");
        if (fecha1[2] === fecha2[2]){
            if (fecha1[1] > fecha2[1]) return respondError(req, res, 400, "La fecha de la recerva debe ser posterior a la fecha actual");
            if (fecha1[1] === fecha2[1]){
                if ((fecha1[0] + 1) > fecha2[0]) return respondError(req, res, 400, "La fecha de la recerva debe ser posterior a la fecha actual");
            }
        }

        const horaReserva = body.hora;
        if (!/^(0[8-9]|[1][0-8]):[0-5][0-9]$/.test(horaReserva)) return respondError(req, res, 400, "La hora de la recerva debe ser entre las 08:00 y las 18:00 horas");
        
        const { error: bodyError } = recervaBodySchema.validate(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);

        const [newRecerva, errorRecerva] = await RecervaService.createRecerva(body);
        if (errorRecerva) return respondError(req, res, 400, errorRecerva);
        if (!newRecerva) return respondError(req, res, 400, "No se pudo crear la recerva");

        respondSuccess(req, res, 201, ["La Recerva Creada Es La Siguiente: ", newRecerva]);
    } catch (error) {
        handleError(error, "recerva.controllers -> createRecerva");
        respondError(req, res, 400, "No se pudo crear la recerva");
    }
}

/**
 * @description Función para actualizar una recerva por su id
 * @param {Object} req Request object - Petición del cliente
 * @param {Object} res Response object - Respuesta del servidor
 */
async function updateRecerva(req, res) {
    try {
        const { params, body } = req;
        const { error: paramsError } = recervaIdSchema.validate(params.id);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const { error: bodyError } = recervaBodySchema.validate(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);

        const [updatedRecerva, errorRecerva] = await RecervaService.updateRecerva(params.id, body);
        if (errorRecerva) return respondError(req, res, 404, errorRecerva);
        if (!updatedRecerva) return respondError(req, res, 400, "No se pudo actualizar la recerva");

        respondSuccess(req, res, 200, ["La Recerva Actualizada Es La Siguiente: ", updatedRecerva]);
    } catch (error) {
        handleError(error, "recerva.controllers -> updateRecerva");
        respondError(req, res, 400, "No se pudo actualizar la recerva");
    }
}

/**
 * @description Función para eliminar una recerva por su id
 * @param {Object} req Request object - Petición del cliente
 * @param {Object} res Response object - Respuesta del servidor
 */
async function deleteRecerva(req, res) {
    try {
        const { params } = req;
        const { error: paramsError } = recervaIdSchema.validate(params.id);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const recerva = await RecervaService.deleteRecerva(params.id);

        !recerva
            ? respondError(req, res, 404, "No se encontro la recerva indicada", "Verifique el id ingresado")
            : respondSuccess(req, res, 200, "La Recerva Fue Eliminada con Exito");
    } catch (error) {
        handleError(error, "recerva.controllers -> deleteRecerva");
        respondError(req, res, 400, "No se pudo eliminar la recerva");
    }
}

function handleMissingId(req, res) {
    respondError(req, res, 400, "Falta el id de la recerva");
}

function handleMissingBody(req, res) {
    respondError(req, res, 400, "Falta el cuerpo de la recerva");
}

module.exports = {
    getRecervas,
    getRecervaById,
    createRecerva,
    updateRecerva,
    deleteRecerva,
    handleMissingId,
    handleMissingBody,
};
