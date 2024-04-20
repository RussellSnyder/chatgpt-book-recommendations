const fs = require("fs");
const { parse } = require("csv-parse");

const books = [];

const booksFilePath = "./books_data.csv";

fs.createReadStream(booksFilePath).pipe(
  parse({
    columns: [
      "Title",
      "description",
      "authors",
      "image",
      "previewLink",
      "publisher",
      "publishedDate",
      "infoLink",
      "categories",
      "ratingsCount",
    ],
    delimiter: ",",
    quote: '"',
    quote_empty: true,
    quote_escape: '"',
    relax_column_count: true,
  })
    .on("data", function (row) {
      books.push(row);
    })
    .on("end", function () {
      const booksJson = JSON.stringify(books);

      const filePath = "./books_data.json";
      try {
        fs.writeFileSync(filePath, booksJson, "utf-8");
      } catch (e) {
        console.log();
      }
    })
);
