const cheerio = require("cheerio");
const rp = require("request-promise");
const moment = require("moment");

const sefas = require("../../config/sefaz");

const caracter = "\\" + '"';
const aspas = '"';
const barras = "\\/";

require("../utils");

module.exports = async (req, res, next) => {
  let url = req.body.url;

  console.log(url);

  if (url.length == 150) {
    console.log();
    url = url.substring(59, 103).trim();
  }
  if (url.length == 126) {
    console.log("entrou 127");
    url = url.substring(82, 127).trim();
  }
  if (url.length == 215) {
    console.log("aquiii 216");
    url = url.substring(57, 101).trim();
  }
  if (url.length == 148) {
    console.log("aquiii 149");
    url = url.substring(57, 101).trim();
  }

  console.log(`${sefas.url_completa}${url}`);

  var options = {
    uri: `${sefas.url_completa}${url}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };

  await rp(options)
    .then(function(html) {
      let $ = cheerio.load(html, {
        decodeEntities: true
      });

      let script = $("script").get(23).children[0].data;
      let format_script = script.substring(433, script.length - 13);

      format_script = format_script.replaceAll(caracter, aspas);
      format_script = format_script.replaceAll(barras, "/");

      $ = cheerio.load(format_script);
      var page = $.root();

      // Dados Gerais
      var table_geral = page.find("div.GeralXslt fieldset table tr").html();
      let chave_acesso = $(table_geral)
        .children()
        .eq(1)
        .text();

      let numero_serie = page.find("td.fixo-nro-serie span").text();
      let versao = page.find("td.fixo-versao-xml span").text();

      req.url = `${sefas.url_completa}${url}`;
      req.chave_acesso = chave_acesso;
      req.numero_serie = numero_serie;
      req.versao = versao;
      // Fim Dados Gerais

      // Dados da NF-e
      var table_geral = page.find("div.aba_container fieldset table tr").html();

      let modelo = $(table_geral)
        .children()
        .eq(1)
        .text();

      let serie = $(table_geral)
        .children()
        .eq(3)
        .text();

      let numero = $(table_geral)
        .children()
        .eq(5)
        .text();

      let data_emissao = $(table_geral)
        .children()
        .eq(7)
        .text();

      let data_emissao_formatada = moment(
        data_emissao,
        "DD/MM/YYYY HH:mm:ss a"
      ).format("DD/MM/YYYY");

      moment.locale("pt-BR");
      data_emissao_formatada = moment(
        data_emissao_formatada,
        "DD/MM/YYYY"
      ).format("LL");

      let data_saida_entrada = $(table_geral)
        .children()
        .eq(9)
        .text();

      let valor_tol_not_fiscal = $(table_geral)
        .children()
        .eq(11)
        .text();

      var row_emitente = page
        .find("div.aba_container fieldset table tr")
        .eq(1)
        .html();

      let cnpj = $(row_emitente)
        .children()
        .eq(1)
        .text();

      let razao_social = $(row_emitente)
        .children()
        .eq(3)
        .text();

      let escricao_estadual = $(row_emitente)
        .children()
        .eq(5)
        .text();

      let uf = $(row_emitente)
        .children()
        .eq(7)
        .text();

      var row_emissao = page
        .find("div.aba_container fieldset table tr")
        .eq(2)
        .html();

      let processo = $(row_emissao)
        .children()
        .eq(1)
        .text();

      processo = processo.replaceAll("\\n", "").trim();

      let versao_processo = $(row_emissao)
        .children()
        .eq(3)
        .text();

      let tipo_emissao = $(row_emissao)
        .children()
        .eq(5)
        .text();

      let finalidade = $(row_emissao)
        .children()
        .eq(7)
        .text();

      finalidade = finalidade.replaceAll("\\n", "").trim();

      row_emissao = page
        .find("div.aba_container fieldset table tr")
        .eq(3)
        .html();

      let natura_operacao = $(row_emissao)
        .children()
        .eq(1)
        .text();

      let tipo_operacao = $(row_emissao)
        .children()
        .eq(3)
        .text();

      tipo_operacao = unescape(
        tipo_operacao
          .replaceAll("\\n", "")
          .replaceAll("\\", "%")
          .trim()
      );

      let forma_pagamento = $(row_emissao)
        .children()
        .eq(5)
        .text();

      let digest = $(row_emissao)
        .children()
        .eq(7)
        .text();

      row_emissao = page
        .find("div.aba_container fieldset table tr")
        .eq(5)
        .html();

      let evento = $(row_emissao)
        .children()
        .eq(0)
        .text();

      evento = unescape(
        evento
          .replaceAll("\\n", "")
          .replaceAll("\\", "%")
          .trim()
      );

      let protocolo = $(row_emissao)
        .children()
        .eq(1)
        .text();

      let data_autorizacao = $(row_emissao)
        .children()
        .eq(2)
        .text();

      let data_inclusao = $(row_emissao)
        .children()
        .eq(3)
        .text();

      req.modelo = modelo;
      req.serie = serie;
      req.numero = numero;
      req.data_emissao = data_emissao;
      req.data_emissao_formatada = data_emissao_formatada;
      req.data_saida_entrada = data_saida_entrada;
      req.valor_tol_not_fiscal = valor_tol_not_fiscal;
      req.cnpj = cnpj;
      req.razao_social = razao_social;
      req.escricao_estadual = escricao_estadual;
      req.uf = uf;
      req.processo = processo;
      req.versao_processo = versao_processo;
      req.tipo_emissao = tipo_emissao;
      req.finalidade = finalidade;
      req.natura_operacao = natura_operacao;
      req.tipo_operacao = tipo_operacao;
      req.forma_pagamento = forma_pagamento;
      req.digest = digest;
      req.evento = evento;
      req.protocolo = protocolo;
      req.data_autorizacao = data_autorizacao;
      req.data_inclusao = data_inclusao;
      // Fim Dados da NF-e

      // Fim Emitente
      let frist_row = page
        .find("div#Emitente table tr")
        .eq(0)
        .html();

      let nome_razao = $(frist_row)
        .children()
        .eq(1)
        .text();

      let nome_fantasia = $(frist_row)
        .children()
        .eq(3)
        .text();

      let second_row = page
        .find("div#Emitente table tr")
        .eq(1)
        .html();

      let endereco = $(second_row)
        .children()
        .eq(3)
        .text();
      endereco = endereco
        .replaceAll("\\n", "")
        .replace(/\s+/g, " ")
        .trim();

      let third_row = page
        .find("div#Emitente table tr")
        .eq(2)
        .html();

      let bairro_distrito = $(third_row)
        .children()
        .eq(1)
        .text();

      let cep = $(third_row)
        .children()
        .eq(3)
        .text();

      let fourth_row = page
        .find("div#Emitente table tr")
        .eq(3)
        .html();

      let municipio = $(fourth_row)
        .children()
        .eq(1)
        .text();

      municipio = municipio
        .replaceAll("\\n", "")
        .replace(/\s+/g, " ")
        .trim();

      let telefone = $(fourth_row)
        .children()
        .eq(3)
        .text();

      let fifth_row = page
        .find("div#Emitente table tr")
        .eq(4)
        .html();

      let pais = $(fifth_row)
        .children()
        .eq(3)
        .text();

      pais = pais
        .replaceAll("\\n", "")
        .replace(/\s+/g, " ")
        .trim();

      req.nome_razao = nome_razao;
      req.nome_fantasia = nome_fantasia;
      req.cnpj = cnpj;
      req.endereco = endereco;
      req.bairro_distrito = bairro_distrito;
      req.cep = cep;
      req.municipio = municipio;
      req.telefone = telefone;
      req.pais = pais;
      // Fim Emitente

      // ITENS
      let produtos = [];
      var nome = "";
      var preco = "";
      var unidade = "";

      page
        .find("div#aba_nft_3 div#Prod fieldset table.toggle tr td")
        .each(function(i, elem) {
          if (i != 0) {
            if ($(this).attr("class") == "fixo-prod-serv-descricao") {
              nome = $(this).text();
            }

            if ($(this).attr("class") == "fixo-prod-serv-vb") {
              preco = $(this).text();
            }

            if ($(this).attr("class") == "fixo-prod-serv-uc") {
              unidade = $(this).text();
            }
          }

          if (nome != "" && preco != "" && unidade != "") {
            // TODO: buscar o NCM na base e adicionalo ao produto
            produtos.push(
              new Object({ nome: nome, preco: preco, unidade: unidade })
            );
            (nome = ""), (preco = ""), (unidade = "");
          }
        });

      const quantidade_produtos = page.find(
        "div#aba_nft_3 div#Prod fieldset div table.toggable table.box tr.col-4"
      ).length;
      let adicionados = 0;

      for (let w = 0; w < quantidade_produtos; w++) {
        page
          .find(
            "div#aba_nft_3 div#Prod fieldset div table.toggable table.box tr.col-4"
          )
          .eq(w)
          .each(function(w, elem) {
            let codigo_produto = $(this)
              .find("td")
              .eq(0)
              .find("span")
              .html();

            let codigo_ncm = $(this)
              .find("td")
              .eq(1)
              .find("span")
              .html();

            produtos[adicionados].codigo_produto = codigo_produto;
            produtos[adicionados].codigo_ncm = codigo_ncm;

            adicionados++;
          });
      }

      req.produtos = produtos;

      // FIM ITENS
    })
    .catch(function(err) {
      console.log("Erro -> ", err);
    });
  next();
};
