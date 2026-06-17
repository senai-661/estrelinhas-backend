import { DatabaseModel } from "./DataBaseModel.js";
import type { MatriculaDTO } from "../interface/MatriculaDTO.js";
import Plano from "./Plano.js";

const database = new DatabaseModel().pool;

class Matricula {
    private idMatricula: number = 0;
    private codAluno: number;
    private codPlano: number;
    private dataMatricula: Date;
    private dataVencimento: Date;
    private valorPago: number;
    private formaPagamento: string;
    private statusMatricula: string;
    private codMatricula: string | undefined;
    private nome: string | undefined;
    private sobrenome: string | undefined;
    private tipoPlano: string | undefined;
    private duracaoDias: number | undefined;
    private valorPlano: number | undefined;
    private statusPlano: string | undefined;

    constructor(
        _codAluno: number,
        _codPlano: number,
        _dataMatricula: Date,
        _dataVencimento: Date,
        _valorPago: number,
        _formaPagamento: string,
        _statusMatricula: string,
        _codMatricula?: string,
        _nome?: string,
        _sobrenome?: string,
        _tipoPlano?: string,
        _duracaoDias?: number,
        _valorPlano?: number,
        _statusPlano?: string
    ) {
        this.codAluno = _codAluno;
        this.codPlano = _codPlano;
        this.dataMatricula = _dataMatricula;
        this.dataVencimento = _dataVencimento;
        this.valorPago = _valorPago;
        this.formaPagamento = _formaPagamento;
        this.statusMatricula = _statusMatricula;
        this.codMatricula = _codMatricula;
        this.nome = _nome;
        this.sobrenome = _sobrenome;
        this.tipoPlano = _tipoPlano;
        this.duracaoDias = _duracaoDias;
        this.valorPlano = _valorPlano;
        this.statusPlano = _statusPlano;
    }

    public getIdMatricula(): number {
        return this.idMatricula;
    }

    public setIdMatricula(idMatricula: number): void {
        this.idMatricula = idMatricula;
    }

    public getCodAluno(): number {
        return this.codAluno;
    }

    public setCodAluno(codAluno: number): void {
        this.codAluno = codAluno;
    }

    public getCodPlano(): number {
        return this.codPlano;
    }

    public setCodPlano(codPlano: number): void {
        this.codPlano = codPlano;
    }

    public getDataMatricula(): Date {
        return this.dataMatricula;
    }

    public setDataMatricula(dataMatricula: Date): void {
        this.dataMatricula = dataMatricula;
    }


    public getDataVencimento(): Date {
        return this.dataVencimento;
    }

    public setDataVencimento(dataVencimento: Date): void {
        this.dataVencimento = dataVencimento;
    }

    public getValorPago(): number {
        return this.valorPago;
    }

    public setValorPago(valorPago: number): void {
        this.valorPago = valorPago;
    }

    public getFormaPagamento(): string {
        return this.formaPagamento;
    }

    public setFormaPagamento(formaPagamento: string): void {
        this.formaPagamento = formaPagamento;
    }

    public getStatusMatricula(): string {
        return this.statusMatricula;
    }

    public setStatusMatricula(statusMatricula: string): void {
        this.statusMatricula = statusMatricula;
    }

    /**
     * Cadastra uma nova matrícula chamando a Stored Procedure sp_cadastrar_matricula.
     * A SP insere a matrícula e atualiza o status do aluno para ATIVO.
     */
    static async cadastrarMatricula(matricula: MatriculaDTO): Promise<boolean> {
        try {
            const plano = await Plano.listarPlano(matricula.id_plano);
            const valorFinal = plano ? plano.getValor() : 0;

            await database.query(
                `CALL sp_cadastrar_matricula($1, $2, $3, $4, $5, $6)`,
                [
                    matricula.id_aluno,
                    matricula.id_plano,
                    matricula.data_inicio,
                    matricula.data_fim,
                    matricula.forma_pagamento,
                    valorFinal
                ]
            );

            return true;
        } catch (error) {
            console.error(`Erro ao cadastrar matrícula: ${error}`);
            return false;
        }
    }

    /**
     * Cancela uma matrícula chamando a Stored Procedure sp_cancelar_matricula.
     * A SP cancela a matrícula e atualiza o status do aluno para INATIVO se necessário.
     */
    static async cancelarMatricula(idMatricula: number): Promise<boolean> {
        try {
            await database.query(
                `CALL sp_cancelar_matricula($1)`,
                [idMatricula]
            );

            return true;
        } catch (error) {
            console.error(`Erro ao cancelar matrícula: ${error}`);
            return false;
        }
    }

    static async listarMatricula(idMatricula: number): Promise<Matricula | null> {
        try {
            const query = `
                SELECT m.*, a.nome AS nome, a.sobrenome AS sobrenome,
                       p.cod_plano AS cod_plano_matricula, p.tipo_plano, p.duracao_dias,
                       p.valor AS valor_plano, p.status_plano
                FROM Matricula m
                JOIN Aluno a ON m.id_aluno = a.id_aluno
                JOIN Plano p ON m.id_plano = p.id_plano
                WHERE m.id_matricula = $1;
            `;
            const respostaBD = await database.query(query, [idMatricula]);

            if (respostaBD.rows.length > 0) {
                const matriculaBD = respostaBD.rows[0];
                const matricula = new Matricula(
                    matriculaBD.id_aluno,
                    matriculaBD.id_plano,
                    matriculaBD.data_inicio,
                    matriculaBD.data_fim,
                    matriculaBD.valor_final,
                    matriculaBD.forma_pagamento,
                    matriculaBD.status_matricula,
                    matriculaBD.cod_matricula,
                    matriculaBD.nome,
                    matriculaBD.sobrenome,
                    matriculaBD.tipo_plano,
                    matriculaBD.duracao_dias,
                    matriculaBD.valor_plano,
                    matriculaBD.status_plano
                );
                matricula.setIdMatricula(matriculaBD.id_matricula);
                return matricula;
            }
            return null;
        } catch (error) {
            console.error(`Erro ao listar matrícula. ${error}`);
            return null;
        }
    }

    static async listarMatriculas(): Promise<Array<Matricula> | null> {
        try {
            const query = `
                SELECT m.*, a.nome AS nome, a.sobrenome AS sobrenome,
                       p.cod_plano AS cod_plano_matricula, p.tipo_plano, p.duracao_dias,
                       p.valor AS valor_plano, p.status_plano
                FROM Matricula m
                JOIN Aluno a ON m.id_aluno = a.id_aluno
                JOIN Plano p ON m.id_plano = p.id_plano;
            `;
            const respostaBD = await database.query(query);
            const matriculas: Array<Matricula> = [];

            respostaBD.rows.forEach((matriculaBD: any) => {
                matriculas.push({
                    idMatricula: matriculaBD.id_matricula,
                    codAluno: matriculaBD.id_aluno,
                    codPlano: matriculaBD.id_plano,
                    dataMatricula: matriculaBD.data_inicio,
                    dataVencimento: matriculaBD.data_fim,
                    valorPago: matriculaBD.valor_final,
                    formaPagamento: matriculaBD.forma_pagamento,
                    statusMatricula: matriculaBD.status_matricula,
                } as any);
            });

            return matriculas;
        } catch (error) {
            console.error(`Erro ao listar matrículas. ${error}`);
            return null;
        }
    }
}

export default Matricula;