const DadosGeraisSchema = new Object({
  chave: {
    type: String,
    required: true
  },
  serie: {
    type: Number,
    required: false
  },
  versao: {
    type: String,
    required: false
  },
  url: {
    type: String,
    required: true
  }
});

module.exports = DadosGeraisSchema;
