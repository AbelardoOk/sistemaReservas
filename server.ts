import express, { Request, Response } from "express";
import bodyParser = require("body-parser");

const app = express();
const port = 3000;
const hostname = "127.0.0.1";

const userRoute = require("./routes/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/user", userRoute);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send({
    mensagem: "API Funcionando Corretamente",
  });
});

app.listen(port, hostname, () => {
  console.log(`Servidor iniciado em ${hostname}:${port}`);
});
