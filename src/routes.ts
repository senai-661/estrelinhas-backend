import { Router } from "express";
import type {Request, Response} from "express";
import AlunoController from "./controller/AlunoController.js";
import PlanoController from "./controller/PlanoController.js";
import MatriculaController from "./controller/MatriculaController.js";

const router: Router = Router();

router.get("/api", (req: Request, res: Response) => {
    res.status(200).json({ mensagem: "Olá, seja bem-vindo ao GymPro!" });
});

router.get("/api/alunos", AlunoController.todos);
router.post("/api/alunos", AlunoController.novo);
router.get("/api/alunos/:idAluno", AlunoController.aluno);

router.get("/api/planos", PlanoController.todos);
router.post("/api/planos", PlanoController.novo);
router.get("/api/planos/:idPlano", PlanoController.plano);

router.get("/api/matriculas", MatriculaController.todos);
router.post("/api/matriculas", MatriculaController.novo);
router.get("/api/matriculas/:idMatricula", MatriculaController.matricula);


export {router};