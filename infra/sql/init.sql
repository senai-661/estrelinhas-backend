CREATE TABLE Aluno (
    id_aluno INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cod_aluno VARCHAR(7) UNIQUE NOT NULL,
    nome VARCHAR(80) NOT NULL,
    sobrenome VARCHAR(80) NOT NULL,
    cpf CHAR(11) UNIQUE NOT NULL,
    data_nascimento DATE,
    endereco VARCHAR(200),
    email VARCHAR(80) UNIQUE NOT NULL,
    celular VARCHAR(20) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    status_aluno VARCHAR(20) DEFAULT 'ATIVO'
);

CREATE TABLE Plano (
    id_plano INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cod_plano VARCHAR(7) UNIQUE NOT NULL,
    tipo_plano VARCHAR(60) NOT NULL,
    duracao_dias INTEGER NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    descricao VARCHAR(255),
    status_plano VARCHAR(20) DEFAULT 'ATIVO'
);

CREATE TABLE Matricula (
    id_matricula INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cod_matricula VARCHAR(7) UNIQUE NOT NULL,
    id_aluno INT REFERENCES Aluno(id_aluno),
    id_plano INT REFERENCES Plano(id_plano),
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    status_matricula VARCHAR(20) NOT NULL,
    forma_pagamento VARCHAR(30),
    valor_final DECIMAL(10,2)
);

INSERT INTO Aluno
(nome, sobrenome, cpf, data_nascimento, endereco, email, celular, senha, status_aluno)
VALUES
('Laís','Zanqueta','12345678909','2008-05-10','Rua das Magnólias, 182 - Sertãozinho','lais@email.com','16989480018','123456','ATIVO'),
('Isabelle','Santos','98765432100','2007-10-21','Rua São João, 450 - Ribeirão Preto','isabelle@email.com','16992345678','123456','INATIVA'),
('Marianna','Monari','74185296320','2008-01-12','Av. Independência, 1200 - Sertãozinho','marianna@email.com','16991234567','123456','ATIVO'),
('Sophia','Gumbio','36925814752','2007-06-30','Rua da Paz, 98 - Sertãozinho','sophia@email.com','16999887766','123456','ATIVO'),
('Tauane','Souza','25814736985','2008-09-18','Rua dos Lírios, 45 - Sertãozinho','tauane@email.com','16997766554','123456','ATIVO'),
('Ana','Lima','11122233344','2006-02-11','Av. Nove de Julho, 300 - Ribeirão Preto','ana@email.com','16996655443','123456','ATIVO'),
('Bruno','Alves','55566677788','2004-03-01','Rua Goiás, 22 - Sertãozinho','bruno@email.com','16995544332','123456','ATIVO'),
('Carla','Rocha','99988877766','2005-08-19','Rua Bahia, 70 - Sertãozinho','carla@email.com','16994433221','123456','ATIVO'),
('Diego','Silva','33344455566','2003-04-25','Rua Minas Gerais, 910 - Ribeirão Preto','diego@email.com','16993322110','123456','ATIVO'),
('Eduarda','Ribeiro','77788899900','2007-07-14','Rua Paraná, 510 - Sertãozinho','eduarda@email.com','16992211009','123456','ATIVO');

INSERT INTO Plano
(tipo_plano, duracao_dias, valor, status_plano)
VALUES
('Básico',30,89.90,'ATIVO'),
('Básico',30,89.90,'ATIVO'),
('Premium',30,149.90,'ATIVO'),
('Black',30,249.90, 'ATIVO'),
('Premium',30,149.90,'ATIVO'),
('Básico',30,89.90,'ATIVO'),
('Black',30,249.90,'ATIVO'),
('Premium',30,149.90,'ATIVO'),
('Black',30,249.90, 'ATIVO'),
('Básico',30,89.90, 'ATIVO');

INSERT INTO Matricula
(id_aluno, id_plano, data_inicio, data_fim, status_matricula, forma_pagamento, valor_final)
VALUES
(1,1,'2026-02-01','2026-03-03','ATIVA','PIX',89.90),
(2,2,'2026-01-10','2026-04-10','FINALIZADA','CARTAO',89.90),
(3,9,'2026-02-05','2026-03-07','ATIVA','DINHEIRO',149.90),
(4,5,'2026-01-15','2026-02-14','FINALIZADA','PIX',249.90),
(5,7,'2026-02-11','2026-03-11','ATIVA','CARTAO',149.90),
(6,3,'2026-01-01','2026-06-01','FINALIZADA','PIX',89.90),
(7,4,'2026-02-01','2027-02-01','ATIVA','CARTAO',249.90),
(8,8,'2026-02-12','2026-02-13','FINALIZADA','DINHEIRO',149.90),
(9,6,'2026-01-20','2026-02-20','CANCELADA','PIX',249.90),
(10,10,'2026-01-05','2026-02-05','FINALIZADA','CARTAO',89.90);