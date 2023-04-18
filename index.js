const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");

const Person = require("./models/person");

app.use(cors());
app.use(express.static("build"));

morgan.token("req-body", (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);

app.use(express.json());

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

let persons = [];

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).send("ERROR ------ Person Not Found").end();
    }
  });
});

app.get("/info", (request, response) => {
  const count = persons.length;
  const date = new Date();
  response.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  const person = new Person({
    name: body.name,
    phoneNumber: body.phoneNumber,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

// app.post("/api/persons", (request, response) => {
//   const body = request.body;

//   if (!body.name || !body.number) {
//     return response.status(400).json({
//       error: "name or number is missing",
//     });
//   }

//   const nameExists = persons.find((person) => person.name === body.name);
//   if (nameExists) {
//     return response.status(400).json({
//       error: "name must be unique",
//     });
//   }

//   const person = {
//     id: Math.floor(Math.random() * 100000),
//     name: body.name,
//     number: body.number,
//   };

//   persons = persons.concat(person);

//   response.json(person);
// });

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
