import express from "express";
import cors from "cors";
import { router } from "./routes.js";

const server = express();
server.use(express.json());
server.use(cors());
server.use(router);

<<<<<<< HEAD
export { server }
=======
server.use(cors()); 
server.use(express.json()); 
server.use(router); 

const PORT = process.env.PORT || 3333;

server.listen(PORT, () => {
    console.log(` Servidor rodando em http://localhost:${PORT}`);
});

export { server };
>>>>>>> 828d46d9c9db95f36b454e0f10bacb101ddbe927
