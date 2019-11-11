const mongoose = require("mongoose");

const Nfce = require("./Nfce");
const Emitente = require("./Emitente");
const Produto = require("./Produto");

const NotaSchema = new mongoose.Schema({
  user: {
    email: {
      type: String,
      required: true,
      lowercase: true
    }
  },
  nfce: {
    type: Object,
    ref: Nfce
  },
  emitente: {
    type: Object,
    ref: Emitente
  },
  produtos: {
    type: [Object],
    ref: Produto,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Nota", NotaSchema);
