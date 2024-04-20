const getEmbedding = require("../utils/getEmbedding");
const getBooksArray = require("./getBooksArray");
const getSubset = require("./getSubset");
const calculateCost = require("../utils/calculateCost");

const sqlite3 = require("sqlite3").verbose();

const createdEmbeddings = async (books) => {
  // absolute path to sqlite db file
  const dbPath = "book_embeddings_cache.db";

  const db = new sqlite3.Database(dbPath);

  try {
    const delete_table_query = `DROP TABLE IF EXISTS embeddings_text_embedding_ada_002`;
    const deleteTable = () => {
      return new Promise((resolve, reject) => {
        db.run(delete_table_query, (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    };
    await deleteTable();

    db.run(`DROP TABLE IF EXISTS embeddings_text_embedding_ada_002`);

    const create_table_query = `
        CREATE TABLE IF NOT EXISTS embeddings_text_embedding_ada_002 (
            id INTEGER PRIMARY KEY,
            text TEXT,
            embedding TEXT,
            title TEXT,
            authors TEXT,
            image TEXT,
            publisher TEXT,
            infoLink TEXT
        )
        `;

    const createTable = () => {
      return new Promise((resolve, reject) => {
        db.run(create_table_query, (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    };
    await createTable();

    // prepare the insert statement
    const stmt = db.prepare(
      `INSERT INTO embeddings_text_embedding_ada_002 (text, embedding, title, authors, image, publisher, infoLink) VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    for (let i = 0; i < books.length; i++) {
      const text = books[i].description;
      const embedding = await getEmbedding(text);
      const title = books[i].Title;
      const authors = books[i].authors;
      const image = books[i].image;
      const publisher = books[i].publisher;
      const infoLink = books[i].infoLink;

      const insertData = (
        text,
        embedding,
        title,
        authors,
        image,
        publisher,
        infoLink
      ) => {
        return new Promise((resolve, reject) => {
          stmt.run(
            text,
            JSON.stringify(embedding),
            title,
            authors,
            image,
            publisher,
            infoLink,
            (err) => {
              if (err) reject(err);
              resolve();
            }
          );
        });
      };
      await insertData(
        text,
        embedding,
        title,
        authors,
        image,
        publisher,
        infoLink
      );
      console.log(`Embedding ${i} in SQLite database"`);
    }
    console.log("Embedding createdand stored in SQLite database");
  } catch (error) {
    console.error(error);
  }
};

const run = async () => {
  const books = getBooksArray();
  const filteredBooks = getSubset({ bookData: books, size: 3000 });
  console.log(filteredBooks.length);
  const descriptions = filteredBooks.map((book) => book.description);
  console.log(descriptions);
  console.log(`Estimated cost: ${calculateCost(descriptions)}`);
  await createdEmbeddings(filteredBooks);
};

run()
  .then(() => {
    console.log("Embeddings created and stored in SQLite database");
  })
  .catch((error) => console.error("an error occured: ", error));
