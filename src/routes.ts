import { Router } from "express";
import type {Request, Response} from "express";
import AlunoController from "./controller/AlunoController.js";
import PlanoController from "./controller/PlanoController.js";
import MatriculaController from "./controller/MatriculaController.js";
import { Auth } from "./middleware/Auth.js";

const router: Router = Router();

router.get("/api", (req: Request, res: Response) => {
    res.status(200).json({ mensagem: "Olá, seja bem-vindo ao GymPro!" });
});

// rota de login (pública)
router.post("/api/login", Auth.validacaoUsuario);

// rotas protegidas
router.get("/api/alunos", Auth.verifyToken, AlunoController.todos);
router.post("/api/alunos", Auth.verifyToken, AlunoController.novo);
router.get("/api/alunos/:idAluno", Auth.verifyToken, AlunoController.aluno);

router.get("/api/planos",  PlanoController.todos);
router.post("/api/planos", PlanoController.novo);
router.get("/api/planos/:idPlano", PlanoController.plano);

router.get("/api/matriculas", Auth.verifyToken, MatriculaController.todos);
router.post("/api/matriculas", Auth.verifyToken, MatriculaController.novo);
router.get("/api/matriculas/:idMatricula", Auth.verifyToken, MatriculaController.matricula);

export {router};