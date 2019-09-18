const mongoose = require("mongoose");

const TotalSchema = new Object({
  valor_produto: {
    type: String,
    required: true
  },
  valor_nota: {
    type: String,
    required: true
  }
});

module.exports = TotalSchema;
