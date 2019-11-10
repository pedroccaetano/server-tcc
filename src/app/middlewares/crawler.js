const Tocantins = require("../crawlers/tocantins");
const Pernambuco = require("../crawlers/pernambuco");
const RioGrandeDoSul = require("../crawlers/rioGrandeDoSul");

const {
  PERNAMBUCO,
  RIO_GRANDE_DO_SUL,
  TOCANTINS
} = require("../../config/sefaz");

module.exports = async (req, res, next) => {
  let { url, email } = req.body;

  console.log("url -. ", url);

  let urlDecisao = url.substr(0, 27);

  if (urlDecisao === PERNAMBUCO) {
    await Pernambuco.scraper(url, email)
      .then(nota => (req.nota = nota))
      .catch(error =>
        console.log("Error ao realizar crawler de Pernambuco", error)
      );
  } else if (urlDecisao === RIO_GRANDE_DO_SUL) {
    await RioGrandeDoSul.scraper(url, email)
      .then(nota => (req.nota = nota))
      .catch(error =>
        console.log("Error ao realizar crawler de Rio Grande do Sul", error)
      );
  } else if (urlDecisao === TOCANTINS) {
    await Tocantins.scraper(url, email)
      .then(nota => (req.nota = nota))
      .catch(error =>
        console.log("Error ao realizar crawler de Toncantins", error)
      );
  }

  next();
};
