-- ============================================================
-- INIT.SQL - GYMPRO
-- ============================================================

-- ============================================================
-- SEQUENCES
-- ============================================================

CREATE SEQUENCE seq_cod_aluno START 1;
CREATE SEQUENCE seq_cod_plano START 1;
CREATE SEQUENCE seq_cod_matricula START 1;


-- ============================================================
-- TABELAS
-- ============================================================

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
    senha VARCHAR(100) NOT NULL,
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


-- ============================================================
-- FUNCTIONS E TRIGGERS - CÓDIGOS AUTOMÁTICOS
-- ============================================================

CREATE OR REPLACE FUNCTION gerar_cod_aluno() RETURNS TRIGGER AS $$
BEGIN
    NEW.cod_aluno := 'ALU' || TO_CHAR(nextval('seq_cod_aluno'), 'FM0000');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_gerar_cod_aluno
BEFORE INSERT ON Aluno
FOR EACH ROW EXECUTE FUNCTION gerar_cod_aluno();

---

CREATE OR REPLACE FUNCTION gerar_cod_plano() RETURNS TRIGGER AS $$
BEGIN
    NEW.cod_plano := 'PLN' || TO_CHAR(nextval('seq_cod_plano'), 'FM0000');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_gerar_cod_plano
BEFORE INSERT ON Plano
FOR EACH ROW EXECUTE FUNCTION gerar_cod_plano();

---

CREATE OR REPLACE FUNCTION gerar_cod_matricula() RETURNS TRIGGER AS $$
BEGIN
    NEW.cod_matricula := 'MAT' || TO_CHAR(nextval('seq_cod_matricula'), 'FM0000');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_gerar_cod_matricula
BEFORE INSERT ON Matricula
FOR EACH ROW EXECUTE FUNCTION gerar_cod_matricula();


-- ============================================================
-- TRIGGER - BLOQUEAR MAIS DE UMA MATRÍCULA ATIVA
-- ============================================================

CREATE OR REPLACE FUNCTION bloquear_mais_de_uma_matricula_ativa()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status_matricula = 'ATIVA' THEN
        IF EXISTS (
            SELECT 1
            FROM Matricula
            WHERE id_aluno = NEW.id_aluno
              AND status_matricula = 'ATIVA'
        ) THEN
            RAISE EXCEPTION 'Aluno já possui matrícula ATIVA.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_matricula_ativa
BEFORE INSERT ON Matricula
FOR EACH ROW EXECUTE FUNCTION bloquear_mais_de_uma_matricula_ativa();


-- ============================================================
-- VIEW - ALUNO COM PLANO ATIVO
-- ============================================================

CREATE OR REPLACE VIEW vw_aluno_com_plano AS
SELECT
    a.id_aluno,
    a.cod_aluno,
    a.nome,
    a.sobrenome,
    a.cpf,
    a.data_nascimento,
    a.endereco,
    a.email,
    a.celular,
    a.status_aluno,
    p.cod_plano,
    p.tipo_plano,
    p.duracao_dias,
    p.valor AS valor_plano,
    p.descricao AS descricao_plano,
    m.cod_matricula,
    m.data_inicio,
    m.data_fim,
    m.status_matricula,
    m.forma_pagamento,
    m.valor_final
FROM Aluno a
LEFT JOIN Matricula m ON m.id_aluno = a.id_aluno
    AND UPPER(m.status_matricula) IN ('ATIVA', 'ATIVO')
LEFT JOIN Plano p ON p.id_plano = m.id_plano;


-- ============================================================
-- STORED PROCEDURES
-- ============================================================

CREATE OR REPLACE PROCEDURE sp_cadastrar_matricula(
    p_id_aluno INTEGER,
    p_id_plano INTEGER,
    p_data_inicio DATE,
    p_data_fim DATE,
    p_forma_pagamento VARCHAR(30),
    p_valor_final DECIMAL(10,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Validação: aluno existe?
    IF NOT EXISTS (SELECT 1 FROM Aluno WHERE id_aluno = p_id_aluno) THEN
        RAISE EXCEPTION 'Aluno com id % não encontrado.', p_id_aluno;
    END IF;

    -- Validação: plano existe?
    IF NOT EXISTS (SELECT 1 FROM Plano WHERE id_plano = p_id_plano) THEN
        RAISE EXCEPTION 'Plano com id % não encontrado.', p_id_plano;
    END IF;

    -- Validação: aluno já possui matrícula ATIVA?
    IF EXISTS (
        SELECT 1 FROM Matricula
        WHERE id_aluno = p_id_aluno AND status_matricula = 'ATIVA'
    ) THEN
        RAISE EXCEPTION 'Aluno já possui uma matrícula ATIVA.';
    END IF;

    -- Insere a matrícula
    INSERT INTO Matricula (id_aluno, id_plano, data_inicio, data_fim, status_matricula, forma_pagamento, valor_final)
    VALUES (p_id_aluno, p_id_plano, p_data_inicio, p_data_fim, 'ATIVA', p_forma_pagamento, p_valor_final);

    -- Atualiza o status do aluno para ATIVO
    UPDATE Aluno SET status_aluno = 'ATIVO' WHERE id_aluno = p_id_aluno;
END;
$$;


CREATE OR REPLACE PROCEDURE sp_cancelar_matricula(
    p_id_matricula INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_aluno INTEGER;
BEGIN
    -- Validação: matrícula existe?
    IF NOT EXISTS (SELECT 1 FROM Matricula WHERE id_matricula = p_id_matricula) THEN
        RAISE EXCEPTION 'Matrícula com id % não encontrada.', p_id_matricula;
    END IF;

    -- Busca o id do aluno
    SELECT id_aluno INTO v_id_aluno FROM Matricula WHERE id_matricula = p_id_matricula;

    -- Cancela a matrícula
    UPDATE Matricula SET status_matricula = 'CANCELADA' WHERE id_matricula = p_id_matricula;

    -- Se o aluno não tiver outra matrícula ATIVA, marca como INATIVO
    IF NOT EXISTS (
        SELECT 1 FROM Matricula
        WHERE id_aluno = v_id_aluno
          AND status_matricula = 'ATIVA'
          AND id_matricula != p_id_matricula
    ) THEN
        UPDATE Aluno SET status_aluno = 'INATIVO' WHERE id_aluno = v_id_aluno;
    END IF;
END;
$$;



INSERT INTO Aluno
(nome, sobrenome, cpf, data_nascimento, endereco, email, celular, senha, status_aluno)
VALUES
('Laís','Zanqueta','12345678909','2008-05-10','Rua das Magnólias, 182 - Sertãozinho','lais@email.com','16989480018','123456','ATIVO'),
('Isabelle','Santos','98765432100','2007-10-21','Rua São João, 450 - Ribeirão Preto','isabelle@email.com','16992345678','123456','INATIVO'),
('Marianna','Monari','74185296320','2008-01-12','Av. Independência, 1200 - Sertãozinho','marianna@email.com','16991234567','123456','ATIVO'),
('Sophia','Gumbio','36925814752','2007-06-30','Rua da Paz, 98 - Sertãozinho','sophia@email.com','16999887766','123456','ATIVO'),
('Tauane','Souza','25814736985','2008-09-18','Rua dos Lírios, 45 - Sertãozinho','tauane@email.com','16997766554','123456','ATIVO'),
('Ana','Lima','11122233344','2006-02-11','Av. Nove de Julho, 300 - Ribeirão Preto','ana@email.com','16996655443','123456','INATIVO'),
('Bruno','Alves','55566677788','2004-03-01','Rua Goiás, 22 - Sertãozinho','bruno@email.com','16995544332','123456','ATIVO'),
('Carla','Rocha','99988877766','2005-08-19','Rua Bahia, 70 - Sertãozinho','carla@email.com','16994433221','123456','INATIVO'),
('Diego','Silva','33344455566','2003-04-25','Rua Minas Gerais, 910 - Ribeirão Preto','diego@email.com','16993322110','123456','INATIVO'),
('Eduarda','Ribeiro','77788899900','2007-07-14','Rua Paraná, 510 - Sertãozinho','eduarda@email.com','16992211009','123456','INATIVO');

INSERT INTO Plano
(tipo_plano, duracao_dias, valor, status_plano)
VALUES
('Básico',30,89.90,'ATIVO'),
('Premium',30,149.90,'ATIVO'),
('Black',30,249.90,'ATIVO'),

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

CREATE OR REPLACE PROCEDURE sp_cadastrar_matricula(
    p_id_aluno INT,
    p_id_plano INT,
    p_data_inicio DATE,
    p_forma_pagamento VARCHAR(30)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_duracao INTEGER;
    v_valor DECIMAL(10,2);
BEGIN

    IF NOT EXISTS (
        SELECT 1
        FROM Aluno
        WHERE id_aluno = p_id_aluno
    ) THEN
        RAISE EXCEPTION 'Aluno não encontrado.';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM Plano
        WHERE id_plano = p_id_plano
    ) THEN
        RAISE EXCEPTION 'Plano não encontrado.';
    END IF;

    SELECT duracao_dias, valor
    INTO v_duracao, v_valor
    FROM Plano
    WHERE id_plano = p_id_plano;

    INSERT INTO Matricula(
        id_aluno,
        id_plano,
        data_inicio,
        data_fim,
        status_matricula,
        forma_pagamento,
        valor_final
    )
    VALUES(
        p_id_aluno,
        p_id_plano,
        p_data_inicio,
        p_data_inicio + v_duracao,
        'ATIVA',
        p_forma_pagamento,
        v_valor
    );

END;
$$;