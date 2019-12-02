const Tocantins = require("../crawlers/Tocantins");
const Pernambuco = require("../crawlers/Pernambuco");
const RioGrandeDoSul = require("../crawlers/RioGrandeDoSul");

const {
  PERNAMBUCO,
  RIO_GRANDE_DO_SUL,
  TOCANTINS
} = require("../../config/sefaz");

module.exports = async (req, res, next) => {
  const { email } = req;

  let { url } = req.body;
  let urlDecisao = url.substr(0, 27);

  const crawlers = new Map()
    .set(PERNAMBUCO, async () => {
      await Pernambuco.scraper(url, email)
        .then(nota => (req.nota = nota))
        .catch(() =>
          res.status(500).send({
            houve_erro: true,
            mensagem: "Error ao realizar crawler de Pernambuco"
          })
        );
    })
    .set(RIO_GRANDE_DO_SUL, async () => {
      await RioGrandeDoSul.scraper(url, email)
        .then(nota => (req.nota = nota))
        .catch(error => {
          const { statusCode, error: errorMessage } = error;

          res.status(500).send({
            houve_erro: true,
            mensagem: "Erro ao realizar crawler de Rio Grande do Sul",
            statusCode,
            errorMessage
          });
        });
    })
    .set(TOCANTINS, async () => {
      await Tocantins.scraper(url, email)
        .then(nota => (req.nota = nota))
        .catch(error => {
          const { statusCode, error: errorMessage } = error;
          res.status(500).send({
            houve_erro: true,
            mensagem: "Error ao realizar crawler de Toncantins",
            statusCode,
            errorMessage
          });
        });
    });

  await crawlers.get(urlDecisao).call();

  next();
};
