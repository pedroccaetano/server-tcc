const mongoose = require("mongoose");

const nfe = require("./Nfe");
const emitente = require("./Emitente");
const produto = require("./Produto");
const total = require("./Total");

const NotaSchema = new mongoose.Schema({
  user: {
    email: {
      type: String,
      required: true
    }
  },
  nfe,
  emitente,
  total,
  produtos: {
    type: [Object],
    ref: produto,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Nota", NotaSchema);
