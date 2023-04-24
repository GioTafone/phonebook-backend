const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI_PHONEBOOK;

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const phoneNumberValidator = {
  validator: function (phoneNumber) {
    const regex = /^(\d{2,3}-\d{7}|\d{3}-\d{6,7})$/;
    return regex.test(phoneNumber);
  },
  message:
    "Phone number must be in the format of 'XX-XXXXXXX' or 'XXX-XXXXXX'.",
};

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  phoneNumber: {
    type: String,
    validate: phoneNumberValidator,
    required: true,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
