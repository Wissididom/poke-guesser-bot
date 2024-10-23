class Database {
  #db = null;

  constructor() {}

  async initDb() {
    this.#db = await new Promise((resolve, reject) => {
      let db = new sqlite3.Database("./database.db", (err) => {
        if (err) {
          console.error(err.message);
          reject(err);
          return;
        }
        console.log("Successfully connected to SQLite");
        resolve(db);
      });
    });
  }

  async get(key) {
    let rows = await new Promise((resolve, reject) => {
      db.all(`SELECT * FROM kv WHERE key = ?`, [key], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
    if (rows.length > 0) {
      return rows[0].value;
    } else {
      return "";
    }
  }

  async set(key, value) {
    await new Promise((resolve, reject) => {
      db.run(
        `CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT)`,
        [],
        (err) => {
          if (err) {
            console.error(err.message);
            reject(err);
            return;
          }
          console.log(`Successfully created table 'kv'`);
          resolve();
        },
      );
    });
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        [key, value],
        (err) => {
          if (err) {
            console.error(err.message);
            reject(err);
            return;
          }
          console.log(
            `Successfully upserted value '${keys[i]}'='${req.body[keys[i]]}'`,
          );
          resolve();
        },
      );
    });
  }

  async delete(key) {
    let rows = await new Promise((resolve, reject) => {
      db.all(`SELECT * FROM kv WHERE key = ?`, [key], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
    if (rows.length > 0) {
      await new Promise((resolve, reject) => {
        db.run(`DELETE FROM kv WHERE key = ?`, [key], (err) => {
          if (err) {
            console.error(err.message);
            reject(err);
            return;
          }
          console.log(`Successfully deleted '${key}'`);
          resolve();
        });
      });
    }
  }

  async list() {
    let rows = await new Promise((resolve, reject) => {
      db.all(`SELECT * FROM kv`, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
    if (rows.length > 0) {
      return rows.map((row) => row.key).join("\n");
    } else {
      return "";
    }
  }
}

module.exports = Database;
