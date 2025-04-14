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
      const overlap = await pool.query(
        `SELECT * FROM reservations
        WHERE room_id = $1
        AND ($2::timestamp, $3::timestamp) OVERLAPS (start_time, end_time)`,
        [roomId, startTime, endTime]
      );

      const now = new Date();
      now.setHours(now.getHours() - 4);
      const diff = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (overlap.rows.length > 0) {
        res.status(400).send({
          erro: "Já existe uma reserva nesta sala e horário.",
        });
      } else if (diff <= 0) {
        res.status(400).send({
          erro: "Data inválida!",
        });
      } else {
        const newReservation = await pool.query(
          `INSERT INTO reservations (user_id, room_id, start_time, end_time) 
           VALUES ($1, $2, $3, $4) RETURNING *`,
          [userId, roomId, startTime, endTime]
        );

        res.status(201).send({
          mensagem: "Agendamento criado com sucesso!",
          info: newReservation.rows[0],
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: `Erro ao criar reserva: ${err}` });
    }
  }
);

module.exports = route;
