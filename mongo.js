const mongoose = require("mongoose");

const password = process.argv[2];
const name = process.argv[3];
const phoneNumber = process.argv[4];

const url = `mongodb+srv://giovannitafone:${password}@cluster0.7rx7nqk.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
});

const Person = mongoose.model("Person", personSchema); // Define the Person model

if (process.argv.length < 3) {
  console.log("Password argument is missing");
  process.exit(1);
} else if (process.argv.length === 3) {
  Person.find({}).then((persons) => {
    console.log("phonebook:");
    persons.forEach((person) => {
      console.log(`${person.name} ${person.phoneNumber}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length < 5) {
  console.log("One of these args is missing: <name> <phoneNumber>");
  process.exit(1);
}

if (name && phoneNumber) {
  const person = new Person({
    name: name,
    phoneNumber: phoneNumber,
  });
  person.save().then((result) => {
    console.log(`added ${name} number ${phoneNumber} to phonebook`);
    mongoose.connection.close();
  });
} else if (process.argv.length === 3) {
  Person.find({}).then((persons) => {
    console.log("phonebook:");
    persons.forEach((person) => {
      console.log(`${person.name} ${person.phoneNumber}`);
    });
    mongoose.connection.close();
  });
}
