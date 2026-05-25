import jwt from 'jsonwebtoken';
import { type Request, type Response, type NextFunction } from 'express';
import DatabaseModel from '../model/DataBaseModel.js';

const SECRET = process.env.JWT_SECRET ?? 'academia_secret';
const database = new DatabaseModel().pool;

interface JwtPayload {
    id: number;
    nome: string;
    email: string;
    role: string;
    exp: number;
}

export class Auth {

    static async validacaoUsuario(req: Request, res: Response): Promise<any> {
        const { email, senha } = req.body;

        const querySelectUser = `SELECT id, nome, email, senha, role FROM Usuario WHERE email=$1 AND senha=$2;`;
        try {
            const queryResult = await database.query(querySelectUser, [email, senha]);

            if (queryResult.rowCount != 0) {
                const usuario = {
                    id: queryResult.rows[0].id,
                    nome: queryResult.rows[0].nome,
                    email: queryResult.rows[0].email,
                    role: queryResult.rows[0].role
                }

                const tokenUsuario = Auth.generateToken(usuario.id, usuario.nome, usuario.email, usuario.role);

                return res.status(200).json({ auth: true, token: tokenUsuario, usuario: usuario });
            } else {
                return res.status(401).json({ auth: false, token: null, message: "E-mail e/ou senha incorretos" });
            }
        } catch (error) {
            console.log(`Erro no modelo: ${error}`);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    static generateToken(id: number, nome: string, email: string, role: string) {
        return jwt.sign({ id, nome, email, role }, SECRET, { expiresIn: '1h' });
    }

    static verifyToken(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['x-access-token'] as string;

        if (!token) {
            return res.status(401).json({ message: "Token não informado", auth: false }).end();
        }

        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: "Token expirado, faça o login novamente", auth: false }).end();
                } else {
                    return res.status(401).json({ message: "Token inválido, faça o login", auth: false }).end();
                }
            }

            if (!decoded) {
                return res.status(401).json({ message: "Token inválido, faça o login", auth: false }).end();
            }

            const { exp, id } = decoded as JwtPayload;

            if (!exp || !id) {
                return res.status(401).json({ message: "Token inválido, faça o login", auth: false }).end();
            }

            const currentTime = Math.floor(Date.now() / 1000);
            if (currentTime > exp) {
                return res.status(401).json({ message: "Token expirado, faça o login novamente", auth: false }).end();
            }

            req.headers['userId'] = String(id);
            next();
        });
    }
}