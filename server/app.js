const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const db = require("./database");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "segredo123",
    resave: false,
    saveUninitialized: true,
  })
);
const path = require("path");
app.use(express.static(path.join(__dirname, "../public")));

app.post("/login", (req, res) => {
  const { email, senha } = req.body;
  db.query(
    "SELECT * FROM Professores WHERE email = ? AND senha = ?",
    [email, senha],
    (err, results) => {
      if (err) return res.status(500).send("Erro no servidor.");
      if (results.length > 0) {
        req.session.user = results[0];
        res.redirect("/principal.html");
      } else {
        res.status(401).send("Usuário ou senha inválidos.");
      }
    }
  );
});


app.get("/turmas", (req, res) => {
  if (!req.session.user) return res.redirect("/index.html");
  const professorId = req.session.user.id;
  db.query(
    "SELECT * FROM Turmas WHERE professor_id = ?",
    [professorId],
    (err, results) => {
      if (err) return res.status(500).send("Erro no servidor.");
      res.json(results);
    }
  );
});


app.post("/turmas", (req, res) => {
  const { nome } = req.body;
  const professorId = req.session.user.id;
  db.query(
    "INSERT INTO Turmas (nome, professor_id) VALUES (?, ?)",
    [nome, professorId],
    (err) => {
      if (err) return res.status(500).send("Erro no servidor.");
      res.sendStatus(201);
    }
  );
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/index.html");
  });
});

// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});

app.get("/", (req, res) => {
  res.redirect("/index.html");
});
