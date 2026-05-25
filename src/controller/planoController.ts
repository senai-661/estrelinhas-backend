import type { Request, Response } from "express";
import Plano from "../model/Plano.js";
import type { PlanoDTO } from "../interface/PlanoDTO.js";

class PlanoController extends Plano {

    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const listaPlanos: Array<Plano> | null = await Plano.listarPlanos();
            return res.status(200).json(listaPlanos);
        } catch (error) {
            console.error(`Erro ao consultar modelo. ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível acessar a lista de planos." });
        }
    }

    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            const dadosRecebidosPlano = req.body;
            const respostaModelo = await Plano.cadastrarPlano(dadosRecebidosPlano);
            if (respostaModelo) {
                return res.status(201).json({ mensagem: "Plano cadastrado com sucesso." });
            } else {
                return res.status(400).json({ mensagem: "Erro ao cadastrar plano." });
            }
        } catch (error) {
            console.error(`Erro no modelo. ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível inserir o plano." });
        }
    }

    static async plano(req: Request, res: Response): Promise<Response> {
        try {
           const codPlano = req.params.idPlano as string;

            if (!codPlano) {
                return res.status(400).json({ mensagem: "Código do plano inválido." });
            }

            const plano = await Plano.listarPlano(codPlano);
            return res.status(200).json(plano);
        } catch (error) {
            console.error(`Erro ao acessar o plano. ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível recuperar o plano." });
        }
    }
}

export default PlanoController;