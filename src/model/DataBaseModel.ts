import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

/**
 * Classe que representa o modelo de banco de dados.
 */
export class DatabaseModel {
  /**
   * Configuração para conexão com o banco de dados
   */
  private _config: object;

  /**
   * Pool de conexões com o banco de dados
   */
  private _pool: pg.Pool;

  /**
   * Cliente de conexão com o banco de dados
   */
  private _client: pg.Client;

  /**
   * Construtor da classe DatabaseModel.
   */
  constructor() {
    // Configuração padrão para conexão com o banco de dados
    this._config = {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      max: 10,
      idleTimoutMillis: 10000,
    };

    // Inicialização do pool de conexões
    this._pool = new pg.Pool(this._config);

    // Inicialização do cliente de conexão
    this._client = new pg.Client(this._config);
  }

  /**
   * Método para testar a conexão com o banco de dados.
   *
   * @returns **true** caso a conexão tenha sido feita, **false** caso negativo
   */
  public async testeConexao() {
    try {
      // Tenta conectar ao banco de dados
      await this._client.connect();
      console.log("Database connected!");
      // Encerra a conexão
      this._client.end();
      return true;
    } catch (error) {
      // Em caso de erro, exibe uma mensagem de erro
      console.log("Error to connect database X( ");
      console.log(error);
      // Encerra a conexão
      this._client.end();
      return false;
    }
  }

  /**
   * Getter para o pool de conexões.
   */
  public get pool() {
    return this._pool;
  }
}
export default DatabaseModel;