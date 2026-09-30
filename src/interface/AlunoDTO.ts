export interface AlunoDTO {
    idAluno?: number;
    codAluno?: string;
    nome: string;
    sobrenome: string;
    cpf: string;
    dataNascimento: Date;
    celular: string;
    statusAluno: string;
    endereco?: string;
    email?: string;

 
    codPlano?: string;
    tipoPlano?: string;
    duracaoDias?: number;
    valorPlano?: number;
    descricaoPlano?: string;
    codMatricula?: string;
    dataInicio?: Date;
    dataFim?: Date;
    statusMatricula?: string;
    formaPagamento?: string;
    valorFinal?: number;
}