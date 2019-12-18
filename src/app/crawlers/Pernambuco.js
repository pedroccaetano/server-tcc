const request = require("request-promise");
const nanoid = require("nanoid");
const convertXml = require("xml-js");
const moment = require("moment");
moment.locale("pt-BR");

const { isSafe } = require("../utils");

class Pernambuco {
  async scraper(url, email) {
    return new Promise(async (resolve, reject) => {
      await request({
        uri: url,
        method: "GET"
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
          let produtos_json = isSafe(() => dadosNota.det, null);

          if (Array.isArray(produtos_json)) {
            produtos_json.forEach(produto => {
              produto = produto.prod;

              produtos.push({
                codigo: isSafe(() => nanoid(), null),
                codigo_produto: isSafe(() => produto.cProd.text, null),
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
          } else {
            produtos.push({
              codigo: isSafe(() => nanoid(), null),
              codigo_produto: isSafe(() => produtos_json.prod.cProd.text, null),
              codigo_barras: isSafe(() => produtos_json.prod.cEAN.text, null),
              nome: isSafe(() => produtos_json.prod.xProd.text, null),
              ncm: isSafe(() => produtos_json.prod.NCM.text, null),
              cfop: isSafe(() => produtos_json.prod.CFOP.text, null),
              unidade: isSafe(() => produtos_json.prod.uCom.text, null),
              quantidade: isSafe(() => produtos_json.prod.qCom.text, null),
              preco_unitario: isSafe(
                () => produtos_json.prod.vUnCom.text,
                null
              ),
              preco_total: isSafe(() => produtos_json.prod.vProd.text, null),
              desconto: isSafe(() => produtos_json.prod.vDesc.text, null)
            });
          }

          let nota = {
            user: {
              email
            },
            nfce: {
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
                "YYYY-MM-DD"
              ).format("LL"),
              valor_produto: isSafe(
                () => dadosNota.total.ICMSTot.vProd.text,
                null
              ),
              valor_nota: isSafe(() => dadosNota.total.ICMSTot.vNF.text, null)
            },
            emitente: {
              nome_razao: isSafe(() => dadosNota.emit.xNome.text, null),
              nome_fantasia: isSafe(() => dadosNota.emit.xFant.text, null),
              cnpj: isSafe(() => dadosNota.emit.CNPJ.text, null),
              escricao_estadual: isSafe(() => dadosNota.emit.IE.text, null),
              endereco: isSafe(
                () => dadosNota.emit.enderEmit.xBairro.text,
                null
              ),
              bairro_distrito: isSafe(
                () => dadosNota.emit.enderEmit.xBairro.text,
                null
              ),
              cep: isSafe(() => dadosNota.emit.enderEmit.CEP.text, null),
              municipio: isSafe(() => dadosNota.emit.enderEmit.xMun.text, null),
              telefone: isSafe(() => dadosNota.emit.enderEmit.fone.text, null),
              uf: isSafe(() => "PE", null)
            },
            produtos
          };

          resolve(nota);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

module.exports = new Pernambuco();
