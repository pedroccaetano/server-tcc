const mongoose = require("mongoose");

const NfeSchema = new Object({
  modelo: {
    type: Number,
    required: true
  },
  serie: {
    type: Number,
    required: false
  },
  numero: {
    type: Number,
    required: false
  },
  data_emissao: {
    type: Date,
    required: false
  },
  data_emissao_formatada: {
    type: String,
    required: false
  },
  data_saida_entrada: {
    type: String,
    required: false
  }
});

module.exports = NfeSchema;
