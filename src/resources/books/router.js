const express = require("express");
const {
  getAllBook,
  getOneBook,
  postOneBook,
  patchOneBook,
  deleteOneBook,
  getFictionBook,
  getNonFictionBook,
  getBookOfAuthor,
} = require("./controller");

const bookRouter = express.Router();

bookRouter.get("/", getAllBook);
bookRouter.get("/fiction", getFictionBook);
bookRouter.get("/non-fiction", getNonFictionBook);
bookRouter.get("/author/:authorName", getBookOfAuthor);
bookRouter.get("/:id", getOneBook);
bookRouter.post("/", postOneBook);
bookRouter.patch("/:id", patchOneBook);
bookRouter.delete("/:id", deleteOneBook);

module.exports = bookRouter;
