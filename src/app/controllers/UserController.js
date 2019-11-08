const User = require("../models/User");

class UserController {
  async store(req, res) {
    const { email } = req.body;

    if (await User.findOne({ email })) {
      return res
        .status(400)
        .json({ resposta: "Usúario já existe!", houve_erro: true });
    }

    const user = await User.create(req.body)
      .then(user => {
        res.json({
          resposta: "Usuário criado com sucesso",
          houve_erro: false,
          user
        });
      })
      .catch(error =>
        res.json({ resposta: "Ocorreu um erro!", houve_erro: true, error })
      );

    return res.json(user);
  }
}

module.exports = new UserController();
