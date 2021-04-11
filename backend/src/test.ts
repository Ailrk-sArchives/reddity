import express from 'express';
import {connection, TableName} from './model';

export const testRouter = express.Router();

testRouter.get('/tables', async (_, res) => {
  const db = await connection;
  const result = await db.all<TableName[]>("select name from sqlite_master where type='table'");
  // console.log(result);
  res.send(`tables in the database ${JSON.stringify(result)}`);
});
