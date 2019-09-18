const mongoose = require("mongoose");

const ProdutoSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true
  },
  codigo_barras: {
    type: String,
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  ncm: {
    type: String,
    required: true
  },
  cfop: {
    type: String,
    required: true
  },
  unidade: {
    type: String,
    required: false
  },
  quantidade: {
    type: String,
    required: false
  },
  preco_unitario: {
    type: String,
    required: false
  },
  preco_unitario: {
    type: String,
    required: false
  },
  desconto: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model("Produto", ProdutoSchema);
