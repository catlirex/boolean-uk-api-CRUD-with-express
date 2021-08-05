const express = require("express");
const {
  getAllBook,
  getOneBook,
  postOneBook,
  patchOneBook,
  deleteOneBook,
  getFictionBook,
  getNonFictionBook,
} = require("./controller");

const bookRouter = express.Router();

bookRouter.get("/", getAllBook);
bookRouter.get("/fiction", getFictionBook);
bookRouter.get("/non-fiction", getNonFictionBook);
bookRouter.get("/:id", getOneBook);
bookRouter.post("/", postOneBook);
bookRouter.patch("/:id", patchOneBook);
bookRouter.delete("/:id", deleteOneBook);

module.exports = bookRouter;
