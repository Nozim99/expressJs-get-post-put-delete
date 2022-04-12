const express = require("express");
const Joi = require("joi");
const app = express();
app.use(express.json());

const categories = [
  { id: 1, name: "game" },
  { id: 2, name: "sport" },
  { id: 3, name: "study" },
];

const schema = Joi.object({
  name: Joi.string().required().min(3),
});

//  bosh sahifaga ma'lumot olish
app.get("/app/categories", (request, response) => {
  if (response) {
    response.status(200).send(categories);
  } else {
    response.status(404).send("Error 404. Ma'lumot topilmadi");
  }
});

// id bo'yicha ma'lumotni qaytarish
app.get("/app/categories/:id", (request, response) => {
  const result = categories.find((e) => e.id == parseInt(request.params.id));
  if (result) {
    response.status(200).send(result);
  } else if (categories.length < +request.params.id) {
    response.send(`id:${request.params.id}    Error "ma'lumot saqlanmagan"`);
  } else {
    response.status(404).send("Error 404   Malumot topilmadi");
  }
});

// ma'lumot qo'shish
app.post("/app/categories", (request, response) => {
  const { error } = schema.validate(request.body);
  if (error) {
    return response.status(400).send(error.details[0].message);
  }
  const book = {
    id: categories.at(-1).id + 1,
    name: request.body.name,
  };

  let key = 0;
  categories.forEach((e) => {
    if (e.name === book.name) key = 1;
  });

  if (key === 0) categories.push(book);
  else {
    return response.status(400).send("Ushbu nomdan foydalanilgan");
  }
  response.status(200).send(categories);
});

app.put("/app/categories/:id", (request, response) => {
  const { error } = schema.validate(request.body);
  if (error) {
    return response.status(400).send(error.details[0].message);
  }

  const book = categories.findIndex(
    (e) => e.id === parseInt(request.params.id)
  );
  categories[book].name = request.body.name;
  response.send(categories);
});

app.delete("/app/delete/:id", (request, response) => {
  if (request.params.id > categories.at(-1).id) {
    return response
      .status(400)
      .send(`id:${request.params.id}: Error! ma'lumot yo'q`);
  }

  const del = categories.findIndex((e) => e.id === parseInt(request.params.id));
  categories.splice(del, 1);
  response.send(categories);
});

port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Serverga ulandi   port: ${5000}`);
});