import DatabaseModel from "./model/DataBaseModel.js";
import { server } from "./server.js";
import dotenv from "dotenv";
dotenv.config();

const port: number = parseInt(process.env.PORT ?? "");

if (isNaN(port)) {
    console.error("Variável de ambiente PORT não definida ou inválida.");
    process.exit(1);
}
const host: string = process.env.HOST ?? "";
const ok = await new DatabaseModel().testeConexao();

if (ok) {
    server.listen(port, () => {
        console.info(`Servidor executando no endereço ${host}:${port}`);
    });
} else {

    console.error("Não foi possível conectar com o banco de dados.");
    process.exit(1);
}