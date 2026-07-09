import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "abandzounou9122",
  database: "zouusafe_db",
});