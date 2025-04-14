import express, { Request, Response } from "express";
import { pool } from "../db";

const route = express.Router();

interface CreateRoomBody {
  name: string;
  location: string;
  capacity: number;
  features: string;
}

route.post(
  "/register",
  async (req: Request<{}, {}, CreateRoomBody>, res: Response) => {
    const { name, location, capacity, features } = req.body;

    try {
      const newRoom = await pool.query(
        "INSERT INTO rooms (name, location, capacity, features) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, location, capacity, features]
      );

      res.status(201).send({
        mensagem: "Sala criado com sucesso",
        newRoom: newRoom.rows[0],
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: `Erro ao criar Sala: ${err}` });
    }
  }
);

module.exports = route;
