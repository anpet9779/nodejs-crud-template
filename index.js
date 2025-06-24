import express from "express";

const app = express();

const port = 3000;
app.use(express.json());

let teaData = [];
let nextId = 1;

/* Add Tea */
app.post("/teas", (req, res) => {
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
