import express, { Request, Response } from "express";
const route = express.Router();
const bcrypt = require("bcrypt");

interface CreateUserBody {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

route.post(
  "/register",
  async (req: Request<{}, {}, CreateUserBody>, res: Response) => {
    const { name, email, password, role } = req.body;

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const newUser = {
      name: name,
      email: email,
      password_hash: password_hash,
      role: role,
    };

    res.status(200).send({
      mensagem: "Usuário criado com sucesso",
      newUser: newUser,
    });
  }
);

module.exports = route;
