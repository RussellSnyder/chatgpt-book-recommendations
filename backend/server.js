//import modules: express, dotenv
const express = require("express");
const dotenv = require("dotenv");
const app = express();
const { EventEmitter } = require("events");

//accept json data in requests
app.use(express.json());

//setup environment variables
dotenv.config();

const getEmbedding = require("./utils/getEmbedding");
const getEmbeddings = require("./utils/getEmbeddings");
const findNearestNeighbors = require("./utils/findNearestNeighbors");

app.post("/api/chatgpt", async (req, res) => {
  try {
    //extract the text from the request body
    const { text } = req.body;

    const embedding = await getEmbedding(text);

    const embeddings = await getEmbeddings();

    const nearestNeighbors = await findNearestNeighbors({
      embedding,
      embeddings,
      k: 5,
    });

    res.json({ nearestNeighbors });
  } catch (error) {
    console.errror(error);
  }
});

//set the PORT
const PORT = process.env.SERVER_PORT || 5001;

//start the server on the chosen PORT
app.listen(PORT, console.log(`Server started on port ${PORT}`));
