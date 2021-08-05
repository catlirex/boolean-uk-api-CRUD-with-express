const express = require("express");

const { getAllPets } = require("./controller");

const petRouter = express.Router();

petRouter.get("/", getAllPets);

module.exports = petRouter;
