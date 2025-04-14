import express, { Request, Response } from "express";
import { pool } from "../db";
const route = express.Router();

interface CreateReservationBody {
  userId: number;
  roomId: number;
  time: string;
}

route.post(
  "/create",
  async (req: Request<{}, {}, CreateReservationBody>, res: Response) => {
    const { userId, roomId, time } = req.body;

    const startTime = new Date(time);
    const endTime = new Date(time);
    endTime.setHours(endTime.getHours() + 2);

    try {
      const newReservation = await await pool.query(
        "INSERT INTO reservations (user_id, room_id, start_time, end_time) VALUES ($1, $2, $3, $4)",
        [userId, roomId, startTime, endTime]
      );

      res.status(201).send({
        mensagem: "Agendamento criado com sucesso!",
        info: newReservation,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: `Erro ao criar reserva: ${err}` });
    }
  }
);

module.exports = route;
