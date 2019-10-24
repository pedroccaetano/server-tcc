const Nota = require("../models/Nota");
const Produto = require("../models/Produto");

class NotaController {
  async store(req, res) {
    const { nota } = req;

    await Nota.create(nota)
      .then(response => {
        return res.json({
          houve_erro: "N",
          mensagem: "Nota salva com sucesso.",
          nota: response
        });
      })
      .catch(error => {
        return res.json({
          houve_erro: "S",
          mensagem: "Operação cancelada.",
          mensage_error: error
        });
      });
  }

  async find(req, res) {
    let {
      productName,
      barcode,
      organization,
      initDate,
      finalDate,
      state
    } = req.params;

    const { email } = req.query;

    const arrayDateInit = initDate.split("-");
    const arrayDateFinal = finalDate.split("-");

    if (productName == '""') {
      productName = "";
    }

    if (organization == '""') {
      organization = "";
    }

    if (barcode == '""') {
      barcode = "";
    }

    if (state == '""') {
      state = "";
    }

    await Nota.find({
      "user.email": email,
      "emitente.uf": new RegExp(state, "i"),
      // "produtos.ncm": new RegExp(barcode, "i"),
      "emitente.nome_razao": new RegExp(organization, "i"),
      "produtos.nome": new RegExp(productName, "i"),
      "nfe.data_emissao": {
        $gte: new Date(arrayDateInit[0], arrayDateInit[1], arrayDateInit[2]),
        $lte: new Date(arrayDateFinal[0], arrayDateFinal[1], arrayDateFinal[2])
      }
    })
      .select("produtos emitente")
      .then(response => {
        let notas = [];

        for (let i = 0; i < response.length; i++) {
          let { produtos, emitente } = response[i];

          for (let w = 0; w < produtos.length; w++) {
            let produto = produtos[w];

            if (
              produto.nome.toUpperCase().includes(productName.toUpperCase())
            ) {
              notas.push({
                emitente: emitente,
                produto: produto,
                id: Math.floor(Math.random() * 10000)
              });
            }
          }
        }

        return res.json({
          houve_erro: "N",
          nota: notas
        });
      })
      .catch(error => {
        return res.json({
          houve_erro: "S",
          mensagem: "Não foi possível fazer a busca."
          // mensagem_error: error.errors["Total.valor_produto"].message
        });
      });
  }

  async findByDate(req, res) {
    const { dateString } = req.params;
    const { email } = req.query;

    const date_split = dateString.split("-");

    let minDate = new Date(parseInt(date_split[0]), parseInt(date_split[1]), 1);
    let maxDate = new Date(parseInt(date_split[0]), minDate.getMonth() + 1, 0);

    await Nota.find({
      "user.email": email,
      "nfe.data_emissao": {
        $gte: minDate,
        $lte: maxDate
      }
    })
      .then(response => {
        return res.json({
          houve_erro: "N",
          nota: response
        });
      })
      .catch(error => {
        return res.json({
          houve_erro: "S",
          mensagem: "Não foi possível fazer a busca."
          // mensagem_error: error.errors["Total.valor_produto"].message
        });
      });
  }

  async update(req, res) {
    const nota = await Nota.findByIdAndUpdate();

    return res.json(nota);
  }

  async destroy(req, res) {
    await Nota.findByIdAndDelete(req.params.id);

    return res.send();
  }

  async show(req, res) {
    const notas = await Nota.find();

    return res.json(notas);
  }
}
module.exports = new NotaController();

// const nota_fiscal = {
//   // TODO: RECEBER INDENTIFICADOR DO USUÁRIO
//   url: req.url,
//   usuario: new Object({
//     id: 1,
//     nome: "Pedro"
//   }),
//   dados_gerais: new Object({
//     chave_acesso: req.chave_acesso,
//     numero_serie: req.numero_serie,
//     versao: req.versao
//   }),
//   nfe: new Object({
//     modelo: req.modelo,
//     serie: req.serie,
//     numero: req.numero,
//     data_emissao: req.data_emissao,
//     data_emissao_formatada: req.data_emissao_formatada,
//     data_saida_entrada: req.data_saida_entrada,
//     valor_tol_not_fiscal: req.valor_tol_not_fiscal,
//     cnpj: req.cnpj,
//     razao_social: req.razao_social,
//     escricao_estadual: req.escricao_estadual,
//     uf: req.uf,
//     processo: req.processo,
//     versao_processo: req.versao_processo,
//     tipo_emissao: req.tipo_emissao,
//     finalidade: req.finalidade,
//     natura_operacao: req.natura_operacao,
//     tipo_operacao: req.tipo_operacao,
//     forma_pagamento: req.forma_pagamento,
//     digest: req.digest,
//     evento: req.evento,
//     protocolo: req.protocolo,
//     data_autorizacao: req.data_autorizacao,
//     data_inclusao: req.data_inclusao
//   }),
//   emitente: new Object({
//     nome_razao: req.nome_razao,
//     nome_fantasia: req.nome_fantasia,
//     cnpj: req.cnpj,
//     endereco: req.endereco,
//     bairro_distrito: req.bairro_distrito,
//     cep: req.cep,
//     municipio: req.municipio,
//     telefone: req.telefone,
//     uf: req.uf,
//     pais: req.pais
//   }),
//   produtos: [req.produtos]
// };
