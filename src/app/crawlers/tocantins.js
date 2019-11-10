const request = require("request-promise");
const cheerio = require("cheerio");
const moment = require("moment");
moment.locale("pt-BR");

const {
  regexProduto,
  regexNome,
  regexQuantidade,
  regexPrecoUnitario,
  regexPrecoTotal,
  regexCNPJ,
  regexCep,
  regexTelefone,
  regexEndereco,
  regexMunicipio,
  regexDataEmisao,
  regexRemoveCaracteres
} = require("../utils/regex");

const { isSafe, baseRequestOptions } = require("../utils");

class Tocantins {
  async scraper(url, email) {
    return new Promise(async (resolve, reject) => {
      await request(baseRequestOptions(url))
        .then(async html => {
          let $ = cheerio.load(html);

          let nome_razao = $("label#j_id_19\\:j_id_1u").text();
          let cnpj = $("label#j_id_19\\:j_id_1v")
            .text()
            .match(regexCNPJ)[0]
            .replace(regexRemoveCaracteres, "");
          let escricao_estadual = $("label#j_id_19\\:j_id_1w")
            .text()
            .replace(regexRemoveCaracteres, "");
          let dadosEmitente = $("label#j_id_19\\:j_id_1x").text();
          let cep = dadosEmitente.match(regexCep)[0];
          let telefone = dadosEmitente.match(regexTelefone)[0];
          let endereco = dadosEmitente.match(regexEndereco)[0];
          let municipio = dadosEmitente.match(regexMunicipio)[0];

          let versao = $("label#j_id_19\\:j_id_2o\\:j_id_34").text();
          let chave = $(
            "tr:contains('Chave de acesso:') td:nth-of-type(2)"
          ).text();
          let serie = $("tr:contains('Série:') td:nth-of-type(2)").text();
          let numero = $("tr:contains('Número:') td:nth-of-type(2)").text();
          let data_emissao = $("tr:contains('Emissão:') td:nth-of-type(2)")
            .text()
            .match(regexDataEmisao)[0];
          let data_emissao_formatada = moment(
            data_emissao,
            "DD-MM-YYYY"
          ).format("LL");
          let valor_nota = $(
            "div.ui-g:nth-of-type(2) div:nth-of-type(2)"
          ).text();

          let temPaginacao = $(
            "div.ui-paginator-bottom span.ui-paginator-pages"
          )
            .text()
            .replace(regexRemoveCaracteres, "")
            .split("")
            .map(elem => parseInt(elem));

          let produtos = [];
          if (temPaginacao.length) {
            while (temPaginacao.length) {
              if (temPaginacao[0] === 1) {
                var produtosHtml = $("tbody.ui-widget-content tr td");

                produtos = produtos.concat(this.buscarProdutos(produtosHtml));
              } else {
                await request(baseRequestOptions(url, true, temPaginacao[0]))
                  .then(html => {
                    let $ = cheerio.load(html);

                    var produtosHtml = $("tbody.ui-widget-content tr td");

                    produtos = produtos.concat(
                      this.buscarProdutos(produtosHtml)
                    );
                  })
                  .catch(() => {
                    console.log(
                      "Erro ao realizar paginação numero ",
                      temPaginacao[0]
                    );
                  });
              }
              temPaginacao.splice(0, 1);
            }
          } else {
            var produtosHtml = $("tbody.ui-widget-content tr td");

            produtos = this.buscarProdutos(produtosHtml);
          }

          let nota = {
            user: {
              email
            },
            nfe: {
              url: isSafe(() => url, null),
              versao: isSafe(() => versao, null),
              chave: isSafe(() => chave, null),
              modelo: isSafe(() => "", null),
              serie: isSafe(() => serie, null),
              numero: isSafe(() => numero, null),
              data_emissao: isSafe(() => data_emissao, null),
              data_emissao_formatada: isSafe(() => data_emissao_formatada, null)
            },
            emitente: {
              nome_razao: isSafe(() => nome_razao, null),
              nome_fantasia: isSafe(() => nome_razao, null),
              cnpj: isSafe(() => cnpj, null),
              escricao_estadual: isSafe(() => escricao_estadual, null),
              endereco: isSafe(() => endereco, null),
              bairro_distrito: isSafe(() => "", null),
              cep: isSafe(() => cep, null),
              municipio: isSafe(() => municipio, null),
              telefone: isSafe(() => telefone, null),
              uf: isSafe(() => "TO", null)
            },
            produtos,
            total: {
              valor_produto: isSafe(() => valor_nota, null),
              valor_nota: isSafe(() => valor_nota, null)
            }
          };

          resolve(nota);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  buscarProdutos = html => {
    let $ = cheerio.load(html);

    let produtos = [];
    let produto = {};

    $(html).each(() => {
      let texto = $(this)
        .text()
        .trim();

      if (texto.match(regexProduto)) {
        produto.codigo = texto.match(regexProduto)[0];
      }

      if (texto.match(regexNome)) {
        produto.nome = texto.match(regexNome)[0];
      }

      if (texto.match(regexQuantidade)) {
        produto.quantidade = texto.match(regexQuantidade)[0];
      }

      if (texto.match(regexQuantidade)) {
        produto.quantidade = texto.match(regexQuantidade)[0];
      }

      if (texto.match(regexPrecoUnitario)) {
        produto.preco_unitario = texto.match(regexPrecoUnitario)[0];
      }

      if (texto.match(regexPrecoTotal)) {
        produto.preco_total = texto.match(regexPrecoTotal)[0];

        produtos.push(produto);

        produto = {};
      }
    });

    return produtos;
  };
}

module.exports = new Tocantins();
