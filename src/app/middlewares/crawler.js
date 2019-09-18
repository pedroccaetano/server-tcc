const rp = require("request-promise");
const convertXml = require("xml-js");
const moment = require("moment");
moment.locale("pt-BR");

const { pernambuco } = require("../../config/sefaz");
const { isSafe } = require("../utils");

const cheerio = require("cheerio");

// const request = require("request");
// const axios = require("axios");

// const caracter = "\\" + '"';
// const aspas = '"';
// const barras = "\\/";

module.exports = async (req, res, next) => {
  let { url, email } = req.body;

  var options = {
    uri: url,
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };

  const aux_url = url.split(new RegExp("([^br]+)"))[1];

  if (aux_url == pernambuco) {
    await rp(options)
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

        let produtos = [];
        let produtos_json = isSafe(
          () => json.nfeProc.proc.nfeProc.NFe.infNFe.det,
          null
        );

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
            preco_unitario: isSafe(() => produto.vUnCom.text, null),
            preco_total: isSafe(() => produto.vProd.text, null),
            desconto: isSafe(() => produto.vDesc.text, null)
          });
        });

        let nota = {
          user: {
            email
          },
          dados: {
            chave: isSafe(
              () => json.nfeProc.proc.nfeProc.NFe.infNFe._attributes.Id,
              null
            ),
            serie: isSafe(
              () => json.nfeProc.proc.nfeProc.NFe.infNFe.ide.nNF.text,
              null
            ),
            versao: isSafe(
              () => json.nfeProc.proc.nfeProc._attributes.versao,
              null
            ),
            url
          },
          nfe: {
            modelo: isSafe(
              () => json.nfeProc.proc.nfeProc.NFe.infNFe.ide.mod.text,
              null
            ),
            serie: isSafe(
              () => json.nfeProc.proc.nfeProc.NFe.infNFe.ide.serie.text,
              null
            ),
            numero: isSafe(
              () => json.nfeProc.proc.nfeProc.NFe.infNFe.ide.nNF.text,
              null
            ),
            data_emissao: isSafe(
              () => json.nfeProc.proc.nfeProc.NFe.infNFe.ide.dhEmi.text,
              null
            ),
            data_emissao_formatada: moment(
              isSafe(
                () => json.nfeProc.proc.nfeProc.NFe.infNFe.ide.dhEmi.text,
                null
              ),
              "YYYY-MM-DDTHH:mm:ssZ"
            ).format("LL")
          },
          emitente: {
            nome_razao: isSafe(
              () => json.nfeProc.proc.nfeProc.NFe.infNFe.emit.xNome.text,
              null
            ),
            nome_fantasia: isSafe(
              () => json.nfeProc.proc.nfeProc.NFe.infNFe.emit.xFant.text,
              null
            ),
            cnpj: isSafe(
              () => json.nfeProc.proc.nfeProc.NFe.infNFe.emit.CNPJ.text,
              null
            ),
            escricao_estadual: isSafe(
              () => json.nfeProc.proc.nfeProc.NFe.infNFe.emit.IE.text,
              null
            ),
            endereco: isSafe(
              () =>
                json.nfeProc.proc.nfeProc.NFe.infNFe.emit.enderEmit.xBairro
                  .text,
              null
            ),
            bairro_distrito: isSafe(
              () =>
                json.nfeProc.proc.nfeProc.NFe.infNFe.emit.enderEmit.xBairro
                  .text,
              null
            ),
            cep: isSafe(
              () =>
                json.nfeProc.proc.nfeProc.NFe.infNFe.emit.enderEmit.CEP.text,
              null
            ),
            municipio: isSafe(
              () =>
                json.nfeProc.proc.nfeProc.NFe.infNFe.emit.enderEmit.xMun.text,
              null
            ),
            telefone: isSafe(
              () =>
                json.nfeProc.proc.nfeProc.NFe.infNFe.emit.enderEmit.fone.text,
              null
            ),
            uf: isSafe(
              () => json.nfeProc.proc.nfeProc.NFe.infNFe.emit.enderEmit.UF.text,
              null
            )
          },
          produtos,
          total: {
            valor_produto: isSafe(
              () =>
                json.nfeProc.proc.nfeProc.NFe.infNFe.total.ICMSTot.vProd.text,
              null
            ),
            valor_nota: isSafe(
              () => json.nfeProc.proc.nfeProc.NFe.infNFe.total.ICMSTot.vNF.text,
              null
            )
          }
        };

        // console.log(nota);

        req.nota = nota;
      })
      .catch(error => {
        console.log(error);
      });
  }

  next();
};
