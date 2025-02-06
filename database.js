// database.js
const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('./messages.db');


db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT,
      user TEXT
    )
  `);
});

const getAllMessages = (callback) => {
  db.all("SELECT * FROM messages", [], (err, rows) => {
    if (err) {
      console.error("Error al obtener los mensajes:", err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
};


const addMessage = (content, user, callback) => {
  const stmt = db.prepare("INSERT INTO messages (content, user) VALUES (?, ?)");
  stmt.run(content, user, function (err) {
    if (err) {
      console.error("Error al agregar el mensaje:", err);
      callback(err, null);
    } else {
      callback(null, { id: this.lastID, content, user });
    }
  });
  stmt.finalize();
};

module.exports = { getAllMessages, addMessage };
