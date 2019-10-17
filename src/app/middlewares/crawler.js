const request = require("request-promise");
const convertXml = require("xml-js");
const moment = require("moment");
const cheerio = require("cheerio");

const { pernambuco, santa_catarina } = require("../../config/sefaz");
const { isSafe } = require("../utils");

moment.locale("pt-BR");

module.exports = async (req, res, next) => {
  let { url, email } = req.body;

  let urlDecisao = url.substr(0, 27);

  if (urlDecisao == pernambuco) {
    await request({
      uri: url,
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(xml => {
        let json = JSON.parse(
          convertXml.xml2json(xml, {
            compact: true,
            spaces: 2,
            ignoreComment: true,
            ignoreDeclaration: true,
            fullTagEmptyElement: true,
            ignoreInstruction: true,
            textKey: "text"
          })
        );

        let dadosNota = json.nfeProc.proc.nfeProc.NFe.infNFe;
        let produtos = [];
        let produtos_json = isSafe(() => dadosNota.det, null); // json.nfeProc.proc.nfeProc.NFe.infNFe.det,

        produtos_json.forEach(produto => {
          produto = produto.prod;

          produtos.push({
            codigo: isSafe(() => produto.cProd.text, null),
            codigo_barras: isSafe(() => produto.cEAN.text, null),
            nome: isSafe(() => produto.xProd.text, null),
            ncm: isSafe(() => produto.NCM.text, null),
            cfop: isSafe(() => produto.CFOP.text, null),
            unidade: isSafe(() => produto.uCom.text, null),
            quantidade: isSafe(() => produto.qCom.text, null),
            preco_unitario: isSafe(
              () => parseFloat(produto.vUnCom.text).toFixed(2),
              null
            ),
            preco_total: isSafe(
              () => parseFloat(produto.vProd.text).toFixed(2),
              null
            ),
            desconto: isSafe(() => produto.vDesc.text, null)
          });
        });

        let nota = {
          user: {
            email
          },
          nfe: {
            url: isSafe(() => url, null),
            versao: isSafe(
              () => json.nfeProc.proc.nfeProc._attributes.versao,
              null
            ),
            chave: isSafe(() => dadosNota._attributes.Id, null),
            modelo: isSafe(() => dadosNota.ide.mod.text, null),
            serie: isSafe(() => dadosNota.ide.serie.text, null),
            numero: isSafe(() => dadosNota.ide.nNF.text, null),
            data_emissao: isSafe(() => dadosNota.ide.dhEmi.text, null),
            data_emissao_formatada: moment(
              isSafe(() => dadosNota.ide.dhEmi.text, null),
              "YYYY-MM-DDTHH:mm:ssZ"
            ).format("LL")
          },
          emitente: {
            nome_razao: isSafe(() => dadosNota.emit.xNome.text, null),
            nome_fantasia: isSafe(() => dadosNota.emit.xFant.text, null),
            cnpj: isSafe(() => dadosNota.emit.CNPJ.text, null),
            escricao_estadual: isSafe(() => dadosNota.emit.IE.text, null),
            endereco: isSafe(() => dadosNota.emit.enderEmit.xBairro.text, null),
            bairro_distrito: isSafe(
              () => dadosNota.emit.enderEmit.xBairro.text,
              null
            ),
            cep: isSafe(() => dadosNota.emit.enderEmit.CEP.text, null),
            municipio: isSafe(() => dadosNota.emit.enderEmit.xMun.text, null),
            telefone: isSafe(() => dadosNota.emit.enderEmit.fone.text, null),
            uf: isSafe(() => dadosNota.emit.enderEmit.UF.text, null)
          },
          produtos,
          total: {
            valor_produto: isSafe(
              () => dadosNota.total.ICMSTot.vProd.text,
              null
            ),
            valor_nota: isSafe(() => dadosNota.total.ICMSTot.vNF.text, null)
          }
        };

        req.nota = nota;
      })
      .catch(error => {
        // console.log(error);
      });
  } else if (urlDecisao === santa_catarina) {
    await request({
      uri: `http://app.scrapingbee.com/api/v1/?api_key=A6X79RC90QIWRLTXAJWUB4VO8IA7IP4VTCVU7IQLOJJU05BQMB9HZ1E6MTSNXLADLJDFZ9WGP97JQ0UK&url=${url}&render_js=True`,
      method: "GET"
    })
      .then(async html => {
        console.log("primeira");
        let $ = cheerio.load(html);

        let urlInterna = $("iframe").attr("src");
        await request({
          uri: `http://app.scrapingbee.com/api/v1/?api_key=A6X79RC90QIWRLTXAJWUB4VO8IA7IP4VTCVU7IQLOJJU05BQMB9HZ1E6MTSNXLADLJDFZ9WGP97JQ0UK&url=${urlInterna}&render_js=True`,
          method: "GET"
        }).then(html => {
          console.log("segunda");
          let $ = cheerio.load(html);

          let page = $.root();

          let chave = $(
            "#respostaWS table table table table tr:nth-of-type(4) td.NFCCabecalho_SubTitulo"
          ).text();

          let emissao = $(
            "td td td tr:nth-of-type(3) tr:nth-of-type(1) td"
          ).text();

          let regexDate = /(\d{2}([/])\d{2}([/])\d{4})/g;
          let data_emissao = emissao.match(regexDate);

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
              preco_unitario: isSafe(
                () => parseFloat(produto[4]).toFixed(2),
                null
              ),
              preco_total: isSafe(() => parseFloat(produto[5]).toFixed(2), null)
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
          ).text();
          endereco = endereco.replace(/\s\s+/g, " ");

          let dadosEmitente = $(
            "tr:nth-of-type(2) td.NFCCabecalho_SubTitulo1"
          ).text();
          dadosEmitente = dadosEmitente.trim();

          let serie = 3;

          let regexNumero = /(\d{6})/g;
          let numero = dadosEmitente.match(regexNumero);
          numero = numero[0];

          let regexCNPJ = /(\d{2}.?\d{3}.?\d{3}[/]?\d{4}-?\d{2})/g;
          let cnpj = dadosEmitente.match(regexCNPJ);
          cnpj = cnpj[0];

          let regexInsEstadual = /(\d{10})/g;
          let escricao_estadual = dadosEmitente.match(regexInsEstadual);
          escricao_estadual = escricao_estadual[0];

          let nota = {
            user: {
              email
            },
            nfe: {
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
              ).format("LL")
            },
            emitente: {
              nome_razao: isSafe(() => nome_fantasia, null),
              nome_fantasia: isSafe(() => nome_fantasia, null),
              cnpj: isSafe(() => cnpj, null),
              escricao_estadual: isSafe(() => escricao_estadual, null),
              endereco: isSafe(() => endereco, null),
              bairro_distrito: isSafe(() => bairro_distrito, null),
              cep: isSafe(() => cep, null),
              municipio: isSafe(() => municipio, null),
              telefone: isSafe(() => telefone, null),
              uf: isSafe(() => "UF", null)
            },
            produtos: isSafe(() => produtos, null),
            total: {
              valor_produto: isSafe(() => valor_produto, null),
              valor_nota: isSafe(() => valor_nota, null)
            }
          };

          req.nota = nota;
        });
      })
      .catch(err => {
        console.log("Erro ao realizar requisição");
      })
      .finally(() => {
        console.log("Finalizou o processo");
      });
  }

  next();
};
