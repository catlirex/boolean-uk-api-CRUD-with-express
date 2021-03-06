const express = require("express");
const morgan = require("morgan");
const db = require("./utils/database");

const bookRouter = require("./resources/books/router");
const petRouter = require("./resources/pets/router");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/books", bookRouter);
app.use("/pets", petRouter);

app.get("*", (req, res) => {
  res.json({ ok: true });
});

const port = 3030;

app.listen(port, () => {
  db.connect((error) => {
    if (error) {
      console.error("[ERROR] Connection error: ", error.stack);
    } else {
      console.log("\n[DB] Connected...\n");
    }
  });
  console.log(`[SERVER] Running on http://localhost:${port}/`);
});
