const Nota = require("../models/Nota");

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
          mensage_error: error.errors["Total.valor_produto"].message
        });
      });
  }

  async find(req, res) {
    let { productName, barcode, organization } = req.params;
    const { email } = req.body;
    let { initDate, finalDate } = req.params;

    initDate = initDate.split("-");
    finalDate = finalDate.split("-");

    initDate = new Date(initDate[0], initDate[1], initDate[2]);
    finalDate = new Date(finalDate[0], finalDate[1], finalDate[2]);

    if (organization == '""') {
      organization = "";
    }

    if (barcode == '""') {
      barcode = "";
    }

    if (productName == '""') {
      productName = "";
    }

    await Nota.find({
      "user.email": email,
      "nfe.data_emissao": {
        $gte: initDate,
        $lte: finalDate
      },
      "produtos.ncm": new RegExp(productName, "i"),
      "produtos.name": new RegExp(barcode, "i"),
      "emitente.nome_razao": new RegExp(organization, "i")
    })
      .then(response => {
        console.log(response);
        return res.json({
          houve_erro: "N",
          nota: response
        });
      })
      .catch(error => {
        return res.json({
          houve_erro: "S",
          mensagem: "Não foi possível fazer a busca.",
          mensagem_error: error.errors["Total.valor_produto"].message
        });
      });

    // res.json({ ok: true });
  }

  async findByDate(req, res) {
    const { dateString } = req.params;
    const { email } = req.body;

    const date_split = dateString.split("-");

    console.log(date_split);

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
        console.log(response);
        return res.json({
          houve_erro: "N",
          nota: response
        });
      })
      .catch(error => {
        return res.json({
          houve_erro: "S",
          mensagem: "Não foi possível fazer a busca.",
          mensagem_error: error.errors["Total.valor_produto"].message
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
