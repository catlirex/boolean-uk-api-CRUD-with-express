const express = require("express");
const {
  getAllBook,
  postOneBook,
  patchOneBook,
  deleteOneBook,
  getBookByType,
} = require("./controller");

const bookRouter = express.Router();

bookRouter.get("/", getAllBook);
bookRouter.post("/", postOneBook);
bookRouter.patch("/:id", patchOneBook);
bookRouter.delete("/:id", deleteOneBook);
bookRouter.get("/:type", getBookByType);

module.exports = bookRouter;
