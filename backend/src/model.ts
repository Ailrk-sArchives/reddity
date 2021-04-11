import * as sqlite from "sqlite";
import * as sqlite3 from "sqlite3";

export interface TableName {
  name: string
}

export interface User {
  user_id: number,
  name: string,
  password: number,
};

export interface Post {
  post_id: number,
  title: string,
  content: string,
  author: string,
  replies: Reply[] | null,
  created_at: string,
  score: number,
};

export interface Reply {
  reply_id: string,
  parent_reply: Reply | null,
  post: Post,
  body: string,
  score: number,
  replies: Reply[] | null
};

export type APITypes =
  | User
  | Post
  | Reply
  ;


const DBPATH = "db.sqlite";
sqlite3.verbose();

///! connect to the database
export const connection = (async () => {
  const db = await sqlite.open({
    filename: DBPATH,
    driver: sqlite3.Database
  });

  const tables = await db.all<TableName[]>("select name from sqlite_master where type='type'");

  if (tables.length == 0) {
    console.error("[Server Error]: The data doesn't contain any tables");
    const file = await db.get("PRAGMA database_list");
    console.error(`[Server Error]: file is from ${JSON.stringify(file)}`);

  } else {
    console.log(`[Server]: Connected to database ${DBPATH}`);
    console.log(`[Server]: Tables: ${JSON.stringify(tables)}`)
  }

  process.on('beforeExit', async () => {
    await db.close();
  });

  return db;
})();
