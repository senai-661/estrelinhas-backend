export interface AlunoDTO {
  nome: string;
  sobrenome: string;
  cpf: string;
  dataNascimento: Date;
  celular: string;
  statusAluno: string;
  endereco?: string;
  email?: string;
}