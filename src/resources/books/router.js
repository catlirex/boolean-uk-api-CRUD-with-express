const express = require("express");
const {
  getAllBook,
  getOneBook,
  postOneBook,
  patchOneBook,
  deleteOneBook,
} = require("./controller");

const bookRouter = express.Router();

bookRouter.get("/", getAllBook);
bookRouter.get("/:id", getOneBook);
bookRouter.post("/", postOneBook);
bookRouter.patch("/:id", patchOneBook);
bookRouter.delete("/:id", deleteOneBook);

module.exports = bookRouter;
