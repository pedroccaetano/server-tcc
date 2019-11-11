const mongoose = require("mongoose");

const NfceSchema = new mongoose.Schema({
  url: {
    type: String,
    required: false
  },
  versao: {
    type: String,
    required: false
  },
  serie: {
    type: Number,
    required: false
  },
  modelo: {
    type: Number,
    required: false
  },
  chave: {
    type: String,
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
  },
  valor_produto: {
    type: String,
    required: false
  },
  valor_nota: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model("Nfce", NfceSchema);
