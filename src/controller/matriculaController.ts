import Matricula from "../model/matricula.js";
import type { Request, Response } from "express";

class MatriculaController extends Matricula {

  static async todos(req: Request, res: Response): Promise<Response> {
    try {
      const listaMatriculas: Array<Matricula> | null =
        await Matricula.listarMatriculas();

      return res.status(200).json(listaMatriculas);

    } catch (error) {
      console.error(`Erro ao consultar modelo. ${error}`);

      return res
        .status(500)
        .json({ mensagem: "Não foi possível acessar a lista de Matrículas." });
    }
  }

  static async novo(req: Request, res: Response): Promise<Response> {
    try {
      const dadosRecebidosMatricula = req.body;
      const respostaModelo =
        await Matricula.cadastrarMatricula(dadosRecebidosMatricula);

      if (respostaModelo) {
        return res
          .status(201)
          .json({ mensagem: "Matrícula cadastrada com sucesso." });
      } else {
        return res
          .status(400)
          .json({ mensagem: "Erro ao cadastrar Matrícula." });
      }

    } catch (error) {
      console.error(`Erro no modelo. ${error}`);
      return res
        .status(500)
        .json({ mensagem: "Não foi possível inserir a Matrícula." });
    }
  }

  static async matricula(req: Request, res: Response): Promise<Response> {
    try {
      const idMatricula: number =
        parseInt(req.params.idMatricula as string);

      if (isNaN(idMatricula) || idMatricula <= 0) {
        return res
          .status(400)
          .json({ mensagem: "ID da Matrícula inválido." });
      }

      const matricula = await Matricula.listarMatricula(idMatricula);

      return res.status(200).json(matricula);

    } catch (error) {
      console.error(`Erro ao acessar a Matrícula. ${error}`);
      return res
        .status(500)
        .json({ mensagem: "Não foi possível recuperar a Matrícula." });
    }
  }
}

export default MatriculaController;