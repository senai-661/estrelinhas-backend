import DatabaseModel from "./model/DataBaseModel.js";
import { server } from "./server.js";
import dotenv from "dotenv";

dotenv.config();

const port: number = parseInt(process.env.PORT as string);
const host: string = process.env.HOST ?? "";

new DatabaseModel().testeConexao().then((ok) => {
    if (ok) {
        server.listen(port, () => {
            console.info(`Servidor executando no endereço ${host}:${port}`);
        });
    } else {
        console.error(`Não foi possível conectar com o banco de dados.`);
    }
})