import express, { Request, Response } from "express";
import { pool } from "../db";

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

    try {
      const newUser = await pool.query(
        "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, email, password_hash, role]
      );

      res.status(201).send({
        mensagem: "Usuário criado com sucesso",
        newUser: newUser.rows[0],
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: `Erro ao criar usuário: ${err}` });
    }
  }
);

module.exports = route;
