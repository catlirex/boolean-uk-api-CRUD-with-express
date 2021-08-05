const Book = require("./model");
const {
  selectAllBooks,
  selectOneBook,
  createOneBook,
  updateOneBook,
  deleteServerBook,
  selectBookByType,
  selectBookByTypeWithTopic,
  selectBookByAuthor,
  selectBookByAuthorSorted,
} = Book();

function getAllBook(req, res) {
  selectAllBooks()
    .then((result) => res.json(result))
    .catch((e) => {
      console.log(e);
      res.status(500).json({ msg: `Internal Server Error, try again later` });
    });
}

function getOneBook(req, res) {
  const bookId = req.params.id;
  selectOneBook(bookId)
    .then((result) => {
      if (result) res.json(result);
      else res.json({ ERROR: `Book not found, bookId: ${bookId}` });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ msg: `Internal Server Error, try again later` });
    });
}

function postOneBook(req, res) {
  let newBook = req.body;
  const validBook = bookObjChecker("new", newBook);
  if (!validBook) return res.json({ ERROR: "BOOK info invalid" });
  createOneBook(newBook)
    .then((result) => res.json(result))
    .catch((e) => {
      console.log(e);
      res.status(500).json({ msg: `Internal Server Error, try again later` });
    });
}

function patchOneBook(req, res) {
  const toUpdateId = req.params.id;
  const toUpdateContent = req.body;
  selectOneBook(toUpdateId)
    .then((result) => {
      if (!result)
        return res.json({ ERROR: `BOOK NOT FOUND bookId:${toUpdateId}` });

      const toUpdateBook = { ...result, ...toUpdateContent };
      const validBook = bookObjChecker("update", toUpdateBook);
      if (!validBook) return res.json({ ERROR: `Update info incorrect` });

      updateOneBook(toUpdateId, toUpdateBook)
        .then((updatedBook) => res.json({ updatedBook }))
        .catch((e) => {
          console.log(e);
          res
            .status(500)
            .json({ msg: `Internal Server Error, try again later` });
        });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ msg: `Internal Server Error, try again later` });
    });
}

function deleteOneBook(req, res) {
  const toDelId = req.params.id;
  selectOneBook(toDelId).then((book) => {
    if (!book) return res.json({ ERROR: `BOOK NOT FOUND, bookId:${toDelId}` });
    deleteServerBook(toDelId)
      .then(() => res.json({ MSG: "DONE" }))
      .catch((e) => {
        console.log(e);
        res.status(500).json({ msg: `Internal Server Error, try again later` });
      });
  });
}

function getFictionBook(req, res) {
  const { topic } = req.query;

  if (!topic) {
    selectBookByType("Fiction")
      .then((result) => res.json({ result }))
      .catch((err) => {
        console.log(err);
        res.status(500).json({ msg: "Internal Server Error, try again later" });
      });
  }
  if (topic) {
    selectBookByTypeWithTopic("Fiction", topic)
      .then((result) => {
        if (result.length) res.json(result);
        else res.json({ msg: "Topic not found" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ msg: "Internal Server Error, try again later" });
      });
  }
}

function getNonFictionBook(req, res) {
  const { topic } = req.query;

  if (!topic) {
    selectBookByType("Non-Fiction")
      .then((result) => res.json({ result }))
      .catch((err) => {
        console.log(err);
        res.status(500).json({ msg: "Internal Server Error, try again later" });
      });
  }
  if (topic) {
    selectBookByTypeWithTopic("Non-Fiction", topic)
      .then((result) => {
        if (result.length) res.json(result);
        else res.json({ msg: "Topic not found" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ msg: "Internal Server Error, try again later" });
      });
  }
}

function getBookOfAuthor(req, res) {
  const authorName = req.params.authorName;
  const { order } = req.query;

  if (!order) {
    selectBookByAuthor(authorName)
      .then((result) => {
        if (result) res.json(result);
        else res.json({ msg: "Result not found" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ msg: "Internal Server Error, try again later" });
      });
  } else if (order === "recent") {
    selectBookByAuthorSorted(authorName)
      .then((result) => {
        if (result) res.json(result);
        else res.json({ msg: "Result not found" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ msg: "Internal Server Error, try again later" });
      });
  } else res.status(400).json({ ERROR: "BAD REQUEST" });
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
  getFictionBook,
  getNonFictionBook,
  getBookOfAuthor,
};
