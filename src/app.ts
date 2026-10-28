import 'dotenv/config';
import { DatabaseModel } from "./model/DataBaseModel.js";
import { server } from "./server.js";

// Pega porta com segurança: Render -> SERVER_PORT -> 3000
function getPort(): number {
    const candidates = [process.env.PORT, process.env.SERVER_PORT, '3000'];
    for (const raw of candidates) {
        if (!raw) continue;
        const n = Number(raw);
        if (Number.isFinite(n) && n >= 0 && n < 65536) return n;
    }
    return 3000;
}

const port = getPort();

new DatabaseModel().testeConexao().then((ok) => {
    if (ok) {
        server.listen(port, '0.0.0.0', () => {
            console.log(`Servidor rodando na porta ${port}`);
        });
    } else {
        console.log('Não foi possível conectar ao banco de dados');
    }
});
