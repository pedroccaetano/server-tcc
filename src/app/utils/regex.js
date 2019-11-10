module.exports = {
  regexProduto: /(?<=Codigo)(.*)/g,
  regexNome: /(?<=Descrição)(.*)/g,
  regexQuantidade: /(?<=Quant.)(.*)/g,
  regexPrecoUnitario: /(?<=Val. UnitR\$ )(.*)/g,
  regexPrecoTotal: /(?<=(?<=Val. TotalR\$ )(.*))(.*)/g,
  regexCNPJ: /(\d{2}.?\d{3}.?\d{3}[/]?\d{4}-?\d{2})/g,
  regexCep: /([0-9]{8,8})/g,
  regexTelefone: /([0-9]{9,15})/g,
  regexEndereco: /(.*?)(?= CEP)/g,
  regexMunicipio: /(.*?)(?= -)/g,
  regexDataEmisao: /(\d{2}([/])\d{2}([/])\d{4})/g,
  regexRemoveCaracteres: /[^\d]+/g,
  regexInsEstadual: /(\d{10})/g,
  regexNumeroEmitente: /(\d{6})/g
};
