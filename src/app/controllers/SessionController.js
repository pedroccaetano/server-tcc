const User = require("../models/User");

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ resposta: "Usuário não encontrado!", houve_erro: true });
    }

    if (!(await user.compareHash(password))) {
      return res
        .status(400)
        .json({ resposta: "Usuário ou senha incorreto!", houve_erro: true });
    }

    return res.json({ user, token: User.generateToken(email) });
  }
}

module.exports = new SessionController();
