import express from "express"; 
import cors from "cors";
import { router } from "./routes.js";
import 'dotenv/config'; // Garante que as variáveis do .env sejam lidas

const server = express();

server.use(cors()); 
server.use(express.json()); 
server.use(router); 

const PORT = process.env.PORT || 3333;

server.listen(PORT, () => {
    console.log(` Servidor rodando em http://localhost:${PORT}`);
});

export { server };