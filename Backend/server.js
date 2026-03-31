const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "login",
  password: "1234",
  port: 5432,
});

pool.connect();

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND senha = $2",
      [email, password],
    );

    if (result.rows.length > 0) {
      return res.json({ success: true });
    }

    res.status(401).json({ success: false, message: "Login inválido" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

// ================= PEGAR PONTOS =================
app.get("/pontos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pontos_servicos");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao consultar o banco de dados");
  }
});
app.post("/pontos", async (req, res) => {
  const { etiqueta, latitude, longitude, logradouro, tipo } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM pontos_servicos WHERE etiqueta = $1 OR (latitude = $2 AND longitude = $3)",
      [etiqueta, latitude, longitude],
    );

    if (result.rows.length > 0) {
      return res
        .status(400)
        .send(
          "Já existe um ponto com a mesma etiqueta, latitude ou longitude.",
        );
    }

    await pool.query(
      "INSERT INTO pontos_servicos (etiqueta, latitude, longitude, logradouro, tipo) VALUES ($1, $2, $3, $4, $5)",
      [etiqueta, latitude, longitude, logradouro, tipo],
    );

    res.status(201).send("Ponto de serviço criado com sucesso!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao criar ponto.");
  }
});

app.put("/pontos/:id", async (req, res) => {
  const { id } = req.params;
  const { etiqueta, latitude, longitude, logradouro, tipo } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM pontos_servicos WHERE (etiqueta = $1 OR (latitude = $2 AND longitude = $3)) AND id != $4",
      [etiqueta, latitude, longitude, id],
    );

    if (result.rows.length > 0) {
      return res
        .status(400)
        .send(
          "Já existe um ponto com a mesma etiqueta, latitude ou longitude.",
        );
    }

    await pool.query(
      "UPDATE pontos_servicos SET etiqueta = $1, latitude = $2, longitude = $3, logradouro = $4, tipo = $5 WHERE id = $6",
      [etiqueta, latitude, longitude, logradouro, tipo, id],
    );

    res.status(200).send("Ponto atualizado com sucesso!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao atualizar ponto.");
  }
});
// ================= DELETE =================e

app.delete("/pontos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM pontos_servicos WHERE id = $1", [id]);

    res.status(200).send("Ponto deletado com sucesso!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao deletar ponto.");
  }
});

// ================= REGISTRO =================
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email e senha são obrigatórios" });
  }

  try {
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email já cadastrado" });
    }

    await pool.query("INSERT INTO users (email, senha) VALUES ($1, $2)", [
      email,
      password,
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Erro interno ao criar conta" });
  }
});

// ================= SERVIDOR LIGADO =================
app.listen(port, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${port}`);
});
