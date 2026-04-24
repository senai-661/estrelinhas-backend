import { DatabaseModel } from "./DataBaseModel.js";
import type { MatriculaDTO } from "../interface/MatriculaDTO.js";

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

    constructor(
        _codAluno: number,
        _codPlano: number,
        _dataMatricula: Date,
        _dataVencimento: Date,
        _valorPago: number,
        _formaPagamento: string,
        _statusMatricula: string
    ) {
        this.codAluno = _codAluno;
        this.codPlano = _codPlano;
        this.dataMatricula = _dataMatricula;
        this.dataVencimento = _dataVencimento;
        this.valorPago = _valorPago;
        this.formaPagamento = _formaPagamento;
        this.statusMatricula = _statusMatricula;
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

    static async cadastrarMatricula(matricula: MatriculaDTO): Promise<boolean> {
        try {
            const query = `
            INSERT INTO Matricula 
            (cod_matricula, id_aluno, id_plano, data_inicio, data_fim, status_matricula, forma_pagamento, valor_final)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id_matricula;
        `;

            const valores = [
                matricula.cod_matricula,
                matricula.id_aluno,
                matricula.id_plano,
                matricula.data_inicio,
                matricula.data_fim,
                matricula.status_matricula,
                matricula.forma_pagamento,
                matricula.valor_final
            ];

            const respostaBD = await database.query(query, valores);

            return (respostaBD.rowCount ?? 0) > 0;
        } catch (error) {
            console.error(`Erro ao cadastrar matrícula: ${error}`);
            return false;
        }
    }
    static async listarMatricula(idMatricula: number): Promise<Matricula | null> {
        try {
            const query = `SELECT * FROM Matricula WHERE id_matricula=$1;`;
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
                    matriculaBD.status_matricula
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
            const query = `SELECT * FROM Matricula;`;
            const respostaBD = await database.query(query);
            const matriculas: Array<Matricula> = [];
            respostaBD.rows.forEach((matriculaBD: any) => {
                const matricula = new Matricula(
                    matriculaBD.id_aluno,
                    matriculaBD.id_plano,
                    matriculaBD.data_inicio,
                    matriculaBD.data_fim,
                    matriculaBD.valor_final,
                    matriculaBD.forma_pagamento,
                    matriculaBD.status_matricula
                );
                matricula.setIdMatricula(matriculaBD.id_matricula);
                matriculas.push(matricula);
            });
            return matriculas;
        } catch (error) {
            console.error(`Erro ao listar matrículas. ${error}`);
            return null;
        }
    }
}
export default Matricula;