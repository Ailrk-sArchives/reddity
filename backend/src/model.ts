import {open} from "sqlite";
import * as sqlite3 from "sqlite3";
import path from 'path';
import fs from 'fs';

sqlite3.verbose()

/// types for interfacing.

export interface TableName {
  name: string
}

export interface User {
  user_id: number,
  name: string,
  password: string,
  email?: string,
  avatar?: string,  // base 64 encode the buffer.
};

export interface Post {
  post_id: number,
  title: string,
  content: string,
  author: string,      //
  replies: Reply[] | null,   //
  created_at: string,
  score: number,
};

export interface Reply {
  reply_id: number,
  author: string,
  body: string,
  score: number,
  created_at: string,
  replies: Reply[] | null //
};

export type APITypes =
  | User
  | Post
  | Reply
  ;


///! types map the database.

export interface UserDB {
  user_id: number,
  name: string,
  password: string,
  email?: string,
  avatar?: Buffer,
};


export interface PostDB {
  post_id: number,
  author_id: number,
  title: string,
  content?: string,
  created_at: string,
  score: number,
};

export interface ReplyDB {
  reply_id: number,
  root_reply_id?: number,
  author_id: string,
  post_id: number,
  body?: string,
  score: number,
  created_at: string,
};

export type DBType =
  | UserDB
  | PostDB
  | ReplyDB
  ;

// If only construct ..DB types from sqlite api we'll never have undefined.

export const toUser = async (u: UserDB): Promise<User> => u as User;
export const fromUser = async (u: User): Promise<UserDB> => u as UserDB;

export const toPost = async (p: PostDB): Promise<Post> => {
  const db = await connection;
  const author = await db.get<{name: string}>(
    "select name from user where user_id = ?",
    p.author_id);
  const replies_ = await db.all<ReplyDB[]>(
    "select * from reply where post_id = ?",
    p.post_id);
  const replies = await Promise.all(replies_.map(toReply));

  return <Post>{
    ...p,
    author: author?.name as string,
    replies
  };
};


export const toReply = async (r: ReplyDB): Promise<Reply> => {
  const db = await connection;
  const author = (await db.get<{name: string}>(
    "select name from user where user_id = ?",
    r.author_id))?.name as string;

  const replies_ = await db.all<ReplyDB[]>(
    "select * from reply where root_reply_id = ?",
    r.reply_id);

  return <Reply>{
    ...r,
    author,
    replies: replies_.length == 0
      ? null
      : await Promise.all(replies_.map(toReply))
  };
};


const DBNAME = "db";
const DBPATH = DBNAME;
sqlite3.verbose();


///! connect to the database
export const connection = (async () => {

  const db = await open({
    filename: DBPATH,
    driver: sqlite3.Database
  });

  const tables = await db.all<TableName[]>("select name from sqlite_master where type='type'");

  if (tables.length == 0) {
    console.error("[Server Error]: The data doesn't contain any tables");
    console.error(`[Server Error]: DBPATH: ${DBPATH}`);
    const file = await db.get("PRAGMA database_list");
    console.error(`[Server Error]: file is from ${JSON.stringify(file)}`);

  } else {
    console.log(`[Server]: Connected to database ${DBPATH}`);
    console.log(`[Server]: Tables: ${JSON.stringify(tables)}`)
  }

  return db;
})();
