const express = require("express");

const {
  getAllPets,
  getOnePet,
  postOnePet,
  patchOnePet,
  deleteOnePet,
} = require("./controller");

const petRouter = express.Router();

petRouter.get("/", getAllPets);
petRouter.get("/:id", getOnePet);
petRouter.post("/", postOnePet);
petRouter.patch("/:id", patchOnePet);
petRouter.delete("/:id", deleteOnePet);

module.exports = petRouter;
