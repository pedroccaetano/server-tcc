const mongoose = require("mongoose");

const EmitenteSchema = new Object({
  nome_razao: {
    type: String,
    required: false
  },
  nome_fantasia: {
    type: String,
    required: false
  },
  cnpj: {
    type: String,
    required: false
  },
  inscricao_estadual: {
    type: String,
    required: false
  },
  endereco: {
    type: String,
    required: false
  },
  bairro: {
    type: String,
    required: false
  },
  cep: {
    type: String,
    required: false
  },
  municipio: {
    type: String,
    required: false
  },
  telefone: {
    type: String,
    required: false
  },
  uf: {
    type: String,
    required: false
  }
});

module.exports = EmitenteSchema;
