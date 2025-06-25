import "dotenv/config";
import express from "express";
// logging libraries
import logger from "./logger.js";
import morgan from "morgan";

const app = express();

const port = process.env.PORT || 3000;
app.use(express.json());

const morganFormat = ":method :url :status :response-time ms";

// Middleware for logging
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

let teaData = [];
let nextId = 1;

/* Add Tea */
app.post("/teas", (req, res) => {
  //logger method can be used for colorful logging similar to console.log
  logger.info("POST");
  const { name, price } = req.body;
  const newTea = { id: nextId++, name, price };

  teaData.push(newTea);
  res.status(201).send(newTea);
});

/* Get All teas */
app.get("/teas", (req, res) => {
  res.status(200).send(teaData);
});

/* Get tea with id */
app.get("/teas/:id", (req, res) => {
  const result = teaData.find((t) => t.id === parseInt(req.params.id));

  if (!result) {
    return res.status(404).send("No tea found");
  }

  res.status(200).send(result);
});

/* update tea */
app.put("/teas/:id", (req, res) => {
  const teaId = req.params.id;

  const tea = teaData.find((t) => t.id === parseInt(req.params.id));

  if (!tea) {
    return res.status(404).send("No tea found");
  } else {
    const { name, price } = req.body;
    tea.name = name;
    tea.price = price;

    res.status(201).send(tea);
  }
});

/* Delete tea */

app.delete("/teas/:id", (req, res) => {
  const index = teaData.findIndex((t) => t.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).send("tea not found!");
  } else {
    const filteredData = teaData.splice(index, 1);

    res.status(204).send("Tea deleted");
  }
});

app.delete("/teas-delete-all", (req, res) => {
  teaData = [];
  res.status(204).send("All teas aredeleted");
});

app.listen(port, () => {
  console.log(`Server is running at port : ${port}`);
});
