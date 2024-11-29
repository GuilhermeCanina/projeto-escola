const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "escola",
});

connection.connect((err) => {
  if (err) console.error("Erro ao conectar ao banco de dados:", err);
  else console.log("Conectado ao banco de dados.");
});

module.exports = connection;