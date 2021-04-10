import * as sqlite from "sqlite";
import * as sqlite3 from "sqlite3";

sqlite3.verbose();

export const connect = async () => {
  return sqlite.open({
    filename: '../db.sqlite',
    driver: sqlite3.Database
  });
};


