const request = require("request-promise");
const cheerio = require("cheerio");
const moment = require("moment");
moment.locale("pt-BR");

const {
  regexCNPJ,
  regexDataEmisao,
  regexRemoveCaracteres,
  regexInsEstadual,
  regexNumeroEmitente
} = require("../utils/regex");

const { isSafe, baseRequestOptions } = require("../utils");

class RioGrandeDoSul {
  scraper = async (url, email) => {
    return new Promise(async (resolve, reject) => {
      await request(baseRequestOptions(url))
        .then(async html => {
          let $ = cheerio.load(html);

          let urlInterna = $("iframe").attr("src");

          await request(baseRequestOptions(urlInterna)).then(html => {
            let $ = cheerio.load(html);

            let page = $.root();

            let chave = $(
              "#respostaWS table table table table tr:nth-of-type(4) td.NFCCabecalho_SubTitulo"
            ).text();

            let emissao = $(
              "td td td tr:nth-of-type(3) tr:nth-of-type(1) td"
            ).text();

            let data_emissao = emissao.match(regexDataEmisao);

            let dadosProdutos = [];
            let arrayProdutos = [];
            let produtos = [];

            page
              .find(
                ".NFCCabecalho tr:nth-of-type(n+2) td.NFCDetalhe_Item:nth-of-type(1), tr:nth-of-type(5) table tbody tr:nth-of-type(n+2) td"
              )
              .each(function(i, elem) {
                dadosProdutos.push($(this).text());
              });

            while (dadosProdutos.length > 0) {
              arrayProdutos.push(dadosProdutos.splice(0, 6));
            }
            arrayProdutos.pop();

            arrayProdutos.forEach(produto => {
              produtos.push({
                codigo: isSafe(() => produto[0], null),
                nome: isSafe(() => produto[1], null),
                quantidade: isSafe(() => produto[2], null),
                unidade: isSafe(() => produto[3], null),
                preco_unitario: isSafe(() => produto[4], null),
                preco_total: isSafe(() => produto[5], null)
              });
            });

            let valor_nota = $(
              ".NFCCabecalho tr:contains('Valor total R$') td[align='right']"
            ).text();

            let nome_fantasia = $(
              "td.NFCCabecalho_SubTitulo[align='left']"
            ).text();

            let endereco = $(
              ".NFCCabecalho tr:nth-of-type(1) td.NFCCabecalho_SubTitulo1"
            )
              .text()
              .replace(/\s\s+/g, " ");

            let dadosEmitente = $(
              "tr:nth-of-type(2) td.NFCCabecalho_SubTitulo1"
            )
              .text()
              .trim();

            let serie = 3;

            let numero = dadosEmitente.match(regexNumeroEmitente)[0];

            let cnpj = dadosEmitente
              .match(regexCNPJ)[0]
              .replace(regexRemoveCaracteres, "");

            let escricao_estadual = dadosEmitente.match(regexInsEstadual)[0];

            let nota = {
              user: {
                email
              },
              nfce: {
                url: isSafe(() => url, null),
                versao: isSafe(() => versao, null),
                serie: isSafe(() => serie, null),
                modelo: isSafe(() => modelo, null),
                chave: isSafe(() => chave, null),
                numero: isSafe(() => numero, null),
                // Verificar formatação do banco de dados
                data_emissao: moment(
                  isSafe(() => data_emissao[0], null),
                  "DD/MM/YYYY"
                ).format("YYYY-MM-DD"),
                data_emissao_formatada: moment(
                  isSafe(() => data_emissao[0], null),
                  "DD-MM-YYYY"
                ).format("LL"),
                valor_produto: isSafe(() => valor_nota.replace(/,/, "."), null),
                valor_nota: isSafe(() => valor_nota.replace(/,/, "."), null)
              },
              emitente: {
                nome_razao: isSafe(() => nome_fantasia, null),
                nome_fantasia: isSafe(() => nome_fantasia, null),
                cnpj: isSafe(() => cnpj, null),
                escricao_estadual: isSafe(() => escricao_estadual, null),
                endereco: isSafe(() => endereco, null),
                bairro_distrito: isSafe(() => bairro_distrito, null),
                cep: isSafe(() => "90000000", null),
                municipio: isSafe(() => municipio, null),
                telefone: isSafe(() => telefone, null),
                uf: isSafe(() => "RS", null)
              },
              produtos: isSafe(() => produtos, null)
            };

            return resolve(nota);
          });
        })
        .catch(error => {
          return reject(error);
        });
    });
  };
}

module.exports = new RioGrandeDoSul();
