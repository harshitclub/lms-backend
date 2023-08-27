const mongoose = require("mongoose");

const validateMongoId = (id) => {
  const validate = mongoose.Types.ObjectId.isValid(id);
  if (!validate) {
    throw new Error("This ID is not valid or Not found...");
  }
};

module.exports = { validateMongoId };
