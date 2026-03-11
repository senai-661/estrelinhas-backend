export interface MatriculaDTO {
    cod_matricula: string;     
    id_aluno: number;
    id_plano: number;          
    data_inicio: string | Date
    data_fim: string | Date;
    status_matricula: string;
    forma_pagamento?: string;  
    valor_final: number;       
}