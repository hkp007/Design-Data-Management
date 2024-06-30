const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data.db');
const db = new sqlite3.Database(dbPath);

function initializeDB() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE,
      bill_no INTEGER,
      lot_no TEXT,
      design_no TEXT,
      design_type TEXT,
      quantity INTEGER,
      qty_type TEXT,
      rate INTEGER,
      amount REAL,
      UNIQUE(bill_no, design_no, design_type)
    )`);
  });
}

function getData() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM data ORDER BY date ASC', [], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

function insertData(row) {
  return new Promise((resolve, reject) => {
    const { date, bill_no, lot_no, design_no, design_type, quantity, qty_type, rate } = row;
    const amount = quantity * rate;
    db.run(`INSERT INTO data (date, bill_no, lot_no, design_no, design_type, quantity, qty_type, rate, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [date, bill_no, lot_no, design_no, design_type, quantity, qty_type, rate, amount],
      function (err) {
        if (err) {
          reject(err);
        }
        resolve({ id: this.lastID });
      });
  });
}

function deleteData(bill_no, design_no, design_type) {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM data WHERE bill_no = ? AND design_no = ? AND design_type = ?`,
      [bill_no, design_no, design_type],
      function (err) {
        if (err) {
          reject(err);
        }
        if (this.changes === 0) {
          resolve({ message: "No data found for the given bill number, design number, and design type." });
        } else {
          resolve({ message: "Data deleted successfully." });
        }
      }
    );
  });
}

function updateData(row) {
  return new Promise((resolve, reject) => {
    const { bill_no, design_no, design_type, date, lot_no, quantity, qty_type, rate } = row;
    const amount = quantity * rate;
    db.run(
      `UPDATE data SET date=?, lot_no=?, quantity=?, qty_type=?, rate=?, amount=? WHERE bill_no=? AND design_no=? AND design_type=?`,
      [date, lot_no, quantity, qty_type, rate, amount, bill_no, design_no, design_type],
      function (err) {
        if (err) {
          reject(err);
        }
        resolve({ id: this.lastID });
      }
    );
  });
}

function searchByDate(startDate, endDate) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM data WHERE date BETWEEN ? AND ? ORDER BY date ASC`,
      [startDate, endDate],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

function searchByDesign(design_no) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM data WHERE design_no = ? ORDER BY date ASC`,
      [design_no],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

module.exports = { initializeDB, getData, insertData, deleteData, updateData, searchByDate, searchByDesign};
