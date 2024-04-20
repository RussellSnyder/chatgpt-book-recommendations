const fs = require("fs");

const getBooksArray = () => {
  try {
    const filePath = "./books_data.json";
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const books = JSON.parse(jsonData);
    return books;
  } catch (error) {
    console.error(error);
    return [];
  }
};

module.exports = getBooksArray;
