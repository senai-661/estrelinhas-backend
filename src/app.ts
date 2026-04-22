
import { server } from "./server.js";
import {DatabaseModel} from "./model/DataBaseModel.js";

const port: number = 3333;

new DatabaseModel().testeConexao().then((resbd) => {
    if(resbd) {
        server.listen(port, () => {
            console.log(`Servidor rodando em http://localhost:${port}`);
        })
    } else {
        console.log('Não foi possível conectar ao banco de dados');
    }
})