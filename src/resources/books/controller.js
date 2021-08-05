const Book = require("./model");
const {
  selectAllBooks,
  selectOneBook,
  createOneBook,
  updateOneBook,
  deleteServerBook,
} = Book();

function getAllBook(req, res) {
  selectAllBooks().then((result) => res.json(result));
}

function getOneBook(req, res) {
  const bookId = req.params.id;
  selectOneBook(bookId).then((result) => {
    if (result) res.json(result);
    else res.json({ ERROR: `Book not found, bookId: ${bookId}` });
  });
}

function postOneBook(req, res) {
  let newBook = req.body;
  const validBook = bookObjChecker("new", newBook);
  if (!validBook) return res.json({ ERROR: "BOOK info invalid" });
  createOneBook(newBook)
    .then((result) => res.json(result))
    .catch(console.error);
}

function patchOneBook(req, res) {
  const toUpdateId = req.params.id;
  const toUpdateContent = req.body;
  selectOneBook(toUpdateId).then((result) => {
    if (!result)
      return res.json({ ERROR: `BOOK NOT FOUND bookId:${toUpdateId}` });

    const toUpdateBook = { ...result, ...toUpdateContent };
    const validBook = bookObjChecker("update", toUpdateBook);
    if (!validBook) return res.json({ ERROR: `Update info incorrect` });

    updateOneBook(toUpdateId, toUpdateBook).then((updatedBook) =>
      res.json({ updatedBook })
    );
  });
}

function deleteOneBook(req, res) {
  const toDelId = req.params.id;
  selectOneBook(toDelId).then((book) => {
    if (!book) return res.json({ ERROR: `BOOK NOT FOUND, bookId:${toDelId}` });
    deleteServerBook(toDelId).then(() => res.json({ MSG: "DONE" }));
  });
}

function bookObjChecker(checkerType, bookObject) {
  const NewBookRequirements = [
    "title",
    "type",
    "author",
    "topic",
    "publicationdate",
  ];
  const UpdateBookRequirements = [
    "id",
    "title",
    "type",
    "author",
    "topic",
    "publicationdate",
  ];
  if (checkerType === "new") {
    const hasAllKeys = NewBookRequirements.every((item) =>
      bookObject.hasOwnProperty(item)
    );
    if (
      hasAllKeys &&
      Object.keys(bookObject).length === NewBookRequirements.length
    )
      return true;
    else return false;
  } else if (checkerType === "update") {
    const hasAllKeys = UpdateBookRequirements.every((item) =>
      bookObject.hasOwnProperty(item)
    );
    if (
      hasAllKeys &&
      Object.keys(bookObject).length === UpdateBookRequirements.length
    )
      return true;
    else return false;
  } else return false;
}

module.exports = {
  getAllBook,
  getOneBook,
  postOneBook,
  patchOneBook,
  deleteOneBook,
};
