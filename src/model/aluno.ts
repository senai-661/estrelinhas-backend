import { DatabaseModel } from "./DataBaseModel.js";
import bcrypt from "bcrypt";

const database = new DatabaseModel().pool;

class Aluno {
  private idAluno: number = 0;
  private nome: string;
  private sobrenome: string;
  private cpf: string;
  private dataNascimento?: Date;
  private endereco?: string;
  private email: string;
  private celular: string;
  private senha: string;
  private statusAluno: string;

  constructor(
    _nome: string,
    _sobrenome: string,
    _cpf: string,
    _dataNascimento: Date,
    _celular: string,
    _senha: string,
    _statusAluno: string,
    _endereco?: string,
    _email?: string
  ) {
    this.nome = _nome;
    this.sobrenome = _sobrenome;
    this.cpf = _cpf;
    this.dataNascimento = _dataNascimento;
    this.celular = _celular;
    this.senha = _senha;
    this.statusAluno = _statusAluno;
    this.endereco = _endereco || '';
    this.email = _email || '';
  }

  public getIdAluno(): number {
    return this.idAluno;
  }
  public setIdAluno(idAluno: number): void {
    this.idAluno = idAluno;
  }

  public getNome(): string {
    return this.nome;
  }
  public setNome(nome: string): void {
    this.nome = nome;
  }

  public getSobrenome(): string {
    return this.sobrenome;
  }
  public setSobrenome(sobrenome: string): void {
    this.sobrenome = sobrenome;
  }

  public getCpf(): string {
    return this.cpf;
  }
  public setCpf(cpf: string): void {
    this.cpf = cpf;
  }

  public getDataNascimento(): Date {
    return this.dataNascimento!;
  }
  public setDataNascimento(dataNascimento: Date): void {
    this.dataNascimento = dataNascimento;
  }

  public getCelular(): string {
    return this.celular;
  }
  public setCelular(celular: string): void {
    this.celular = celular;
  }

  public getEmail(): string {
    return this.email;
  }
  public setEmail(email: string): void {
    this.email = email;
  }

  public getEndereco(): string {
    return this.endereco!;
  }
  public setEndereco(endereco: string): void {
    this.endereco = endereco;
  }

  public getSenha(): string {
    return this.senha;
  }
  public setSenha(senha: string): void {
    this.senha = senha;
  }

  public getStatusAluno(): string {
    return this.statusAluno;
  }
  public setStatusAluno(statusAluno: string): void {
    this.statusAluno = statusAluno;
  }

  static async listarAlunos(): Promise<Array<Aluno> | null> {
    try {
      const lista: Array<Aluno> = [];

      const query = `SELECT id_aluno, nome, sobrenome, cpf, data_nascimento, endereco, email, celular, status_aluno FROM Aluno;`;
      const respostaBD = await database.query(query);

      respostaBD.rows.forEach((alunoBD: any) => {
        const novoAluno = new Aluno(
          alunoBD.nome,
          alunoBD.sobrenome,
          alunoBD.cpf,
          alunoBD.data_nascimento,
          alunoBD.celular,
          alunoBD.senha,       
          alunoBD.status_aluno, 
          alunoBD.endereco,    
          alunoBD.email        
        );

        novoAluno.setIdAluno(alunoBD.id_aluno);
        lista.push(novoAluno);
      });

      return lista;
    } catch (error) {
      console.error(`Erro ao listar alunos. ${error}`);
      return null;
    }
  }

  static async cadastrarAluno(aluno: any): Promise<boolean> {
    try {
      const query = `
        INSERT INTO Aluno (nome, sobrenome, cpf, data_nascimento, endereco, email, celular, senha, status_aluno)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id_aluno;
      `;

      const respostaBD = await database.query(query, [
        aluno.nome.toUpperCase(),
        aluno.sobrenome.toUpperCase(),
        aluno.cpf,
        aluno.dataNascimento,
        aluno.endereco,
        aluno.email?.toLowerCase(),
        aluno.celular,
        aluno.senha,
        aluno.statusAluno
      ]);

      if (respostaBD.rows.length > 0) {
        console.info(`Aluno cadastrado com sucesso. ID: ${respostaBD.rows[0].id_aluno}`);
        return true;
      }

      return false;
    } catch (error) {
      console.error(`Erro ao cadastrar aluno. ${error}`);
      return false;
    }
  }

  static async listarAluno(idAluno: number): Promise<Aluno | null> {
    try {
      const query = `SELECT * FROM Aluno WHERE id_aluno=$1;`;
      const respostaBD = await database.query(query, [idAluno]);

      if (respostaBD.rowCount && respostaBD.rowCount > 0) {
        const alunoBD = respostaBD.rows[0];

        const aluno = new Aluno(
          alunoBD.nome,
          alunoBD.sobrenome,
          alunoBD.cpf,
          alunoBD.data_nascimento,
          alunoBD.celular,
          alunoBD.senha,        // Ordem corrigida
          alunoBD.status_aluno, // Ordem corrigida
          alunoBD.endereco,     // Ordem corrigida
          alunoBD.email         // Ordem corrigida
        );

        aluno.setIdAluno(alunoBD.id_aluno);
        return aluno;
      }

      return null;
    } catch (error) {
      console.error(`Erro ao buscar aluno no banco. ${error}`);
      return null;
    }
  }
}

export default Aluno;