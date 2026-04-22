import Aluno from "../model/Aluno.js";
import type { Request, Response } from "express";

class AlunoController extends Aluno {
  /**
   * Faz a chamada ao modelo para obter a lista de Alunos e devolve ao Aluno
   *
   * @param req Requisição do Aluno
   * @param res Resposta do servidor                    
   * @returns (200) Lista de todos os Alunos
   * @returns (500) Erro na consulta
   */
  static async todos(req: Request, res: Response): Promise<Response> {
    try {
      const listaAlunos: Array<Aluno> | null = await Aluno.listarAlunos();

      return res.status(200).json(listaAlunos);
    } catch (error) {
      console.error(`Erro ao consultar modelo. ${error}`);

      return res
        .status(500)
        .json({ mensagem: "Não foi possivel acessar a lista de Alunos." });
    }
  }
  static async novo(req: Request, res: Response): Promise<Response> {
    try {
      const dadosRecebidosAluno = req.body;
      const respostaModelo = await Aluno.cadastrarAluno(dadosRecebidosAluno);

      if (respostaModelo) {
        return res
          .status(201)
          .json({ mensagem: "Aluno cadastrado com sucesso." });
      } else {
        return res.status(400).json({ mensagem: "Erro ao cadastrar Aluno." });
      }
    } catch (error) {
      console.error(`Erro no modelo. ${error}`);
      return res
        .status(500)
        .json({ mensagem: "Não foi possivel inserir o Aluno." });
    }
  }
  static async aluno(req: Request, res: Response): Promise<Response> {
    try {
      const idAluno: number = parseInt(req.params.idAluno as string);

      if (isNaN(idAluno) || idAluno <= 0) {
        return res.status(400).json({ mensagem: "ID do Aluno inválido." });
      }

      const aluno = await Aluno.listarAluno(idAluno);

      return res.status(200).json(aluno);
    } catch (error) {
      console.error(`Erro ao acessar o Aluno. ${error}`);
      return res
        .status(500)
        .json({ mensagem: "Não foi possível recuperar o Aluno." });
    }
  }
}

export default AlunoController;