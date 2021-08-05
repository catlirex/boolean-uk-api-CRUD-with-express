const db = require("../../utils/database");
const { buildBooksDatabase } = require("../../utils/mockData");

function Book() {
  function createTable() {
    const createTable = `
        DROP TABLE IF EXISTS books;
      
        CREATE TABLE IF NOT EXISTS books (
        id              SERIAL        PRIMARY KEY,
        title           VARCHAR(255)   NOT NULL,
        type            VARCHAR(255)   NOT NULL,
        author          VARCHAR(255)   NOT NULL,
        topic           VARCHAR(255)   NOT NULL,
        publicationdate DATE           NOT NULL
      );
    `;

    db.query(createTable)
      .then(() => console.log("[DB] BOOK Table ready"))
      .catch(console.error);
  }

  function addMockData() {
    const createBook = `
    INSERT INTO books
      (title, type, author, topic, publicationdate)
    VALUES
      ($1, $2, $3, $4, $5)
  `;

    const books = buildBooksDatabase();

    books.forEach((book) => {
      db.query(createBook, Object.values(book)).catch(console.error);
    });
  }

  async function selectAllBooks() {
    const selectAll = `
    SELECT *  books
    LIMIT 50`;

    try {
      const result = await db.query(selectAll);
      return result.rows;
    } catch (e) {
      throw e;
    }
  }

  async function selectOneBook(bookId) {
    const selectOne = `
      SELECT * FROM books
      WHERE id = $1;`;

    try {
      const result = await db.query(selectOne, [bookId]);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }

  async function createOneBook(newBook) {
    const { title, type, author, topic, publicationdate } = newBook;
    const createOne = `
    INSERT INTO books (title, type, author, topic, publicationdate)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `;

    try {
      const result = await db.query(createOne, [
        title,
        type,
        author,
        topic,
        publicationdate,
      ]);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }

  async function updateOneBook(id, toUpdateBook) {
    const { title, type, author, topic, publicationdate } = toUpdateBook;
    const updateBook = `
      UPDATE books
      SET   title = $2,
            type = $3,
            author = $4,
            topic = $5,
            publicationdate = $6
      WHERE id = $1
      RETURNING *;`;
    try {
      const result = await db.query(updateBook, [
        id,
        title,
        type,
        author,
        topic,
        publicationdate,
      ]);

      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }

  async function deleteServerBook(id) {
    const delBook = `
        DELETE FROM books
        WHERE id = $1;`;

    try {
      const result = await db.query(delBook, [id]);
      return result;
    } catch (e) {
      throw e;
    }
  }

  createTable();
  addMockData();

  return {
    selectAllBooks,
    selectOneBook,
    createOneBook,
    updateOneBook,
    deleteServerBook,
  };
}

module.exports = Book;
