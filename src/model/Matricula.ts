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

    public getIdMatricula(): number { return this.idMatricula; }
    public setIdMatricula(idMatricula: number): void { this.idMatricula = idMatricula; }
    public getCodAluno(): number { return this.codAluno; }
    public setCodAluno(codAluno: number): void { this.codAluno = codAluno; }
    public getCodPlano(): number { return this.codPlano; }
    public setCodPlano(codPlano: number): void { this.codPlano = codPlano; }
    public getDataMatricula(): Date { return this.dataMatricula; }
    public setDataMatricula(dataMatricula: Date): void { this.dataMatricula = dataMatricula; }
    public getDataVencimento(): Date { return this.dataVencimento; }
    public setDataVencimento(dataVencimento: Date): void { this.dataVencimento = dataVencimento; }
    public getValorPago(): number { return this.valorPago; }
    public setValorPago(valorPago: number): void { this.valorPago = valorPago; }
    public getFormaPagamento(): string { return this.formaPagamento; }
    public setFormaPagamento(formaPagamento: string): void { this.formaPagamento = formaPagamento; }
    public getStatusMatricula(): string { return this.statusMatricula; }
    public setStatusMatricula(statusMatricula: string): void { this.statusMatricula = statusMatricula; }

    // INSERT continua na tabela direta (não na view)
    static async cadastrarMatricula(matricula: MatriculaDTO): Promise<boolean> {
    try {
        const plano = await Plano.listarPlano(matricula.id_plano);
        const valorFinal = plano ? plano.getValor() : 0;
       

     
        const query = `
            INSERT INTO Matricula 
            (id_aluno, id_plano, data_inicio, data_fim, status_matricula, forma_pagamento, valor_final)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id_matricula;
        `;

        const valores = [
            matricula.id_aluno,
            matricula.id_plano,
            matricula.data_inicio,
            matricula.data_fim,
            'ATIVO',
            matricula.forma_pagamento,
            valorFinal
        ];

        const respostaBD = await database.query(query, valores);
        return (respostaBD.rowCount ?? 0) > 0;

    } catch (error) {
        console.error(`Erro ao cadastrar matrícula: ${error}`);
        return false;
    }



    }

    // listarMatriculas agora usa a VIEW
    static async listarMatriculas(): Promise<any[] | null> {
        try {
            const query = `SELECT * FROM vw_matriculas_detalhadas ORDER BY id_matricula;`;
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
            
        
    } catch(error) {
        console.error(`Erro ao listar matrículas. ${error}`);
        return null;
    }
    }
    // listarMatricula por ID também usa a VIEW
    static async listarMatricula(idMatricula: number): Promise<any | null> {
        try {
            const query = `SELECT * FROM vw_matriculas_detalhadas WHERE id_matricula = $1;`;
            const respostaBD = await database.query(query, [idMatricula]);
            return respostaBD.rows[0] || null;
        } catch (error) {
            console.error(`Erro ao listar matrícula. ${error}`);
            return null;
        }
    }

    // filtro por status usando a VIEW
    static async listarMatriculasPorStatus(status: string): Promise<any[] | null> {
        try {
            const query = `SELECT * FROM vw_matriculas_detalhadas WHERE status_matricula = $1;`;
            const respostaBD = await database.query(query, [status]);
            return respostaBD.rows;
        } catch (error) {
            console.error(`Erro ao filtrar matrículas. ${error}`);
            return null;
        }
    }
}

export default Matricula;