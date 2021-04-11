import express from "express";
import {testRouter} from "./test";
import {loggerMW, requestTimeMW} from "./middlewares";
import {connection, APITypes, User, Post, Reply, TableName, DBType, UserDB, PostDB, ReplyDB, toPost, toUser, toReply} from "./model";

const app = express()
const PORT = 8080


app.use(requestTimeMW);
app.use(loggerMW);
app.use(express.json());


///! index
app.route('/')
  .get((_, res) => {
    res.send("TESTING")
  });

///! login
app.route('/login/:name')
  .post(async (req, res) => {
    const db = await connection;
    const u = (req.body as User);
    const u_ = await db.get<User>(
      "select name, password from user where user_id = ?", u.user_id);
    if (u_ && u_.password == u.password) {
      // TODO
      console.log("yes");
    }
    res.send(req.body);
  })

///! List of posts sorted by popularities
app.route('/popular')
  .get(async (_, res) => {
    try {
      const db = await connection;
      const posts_ = await db.all<PostDB[]>("select * from post order by score");
      const posts = await Promise.all(posts_.map(toPost));
      res.status(200).json(posts);

    } catch (e) {
      res.status(400).json({
        msg: "error",
        info: `${e}`
      })
    }

  });

///! List of posts sorted by date
app.route('/new')
  .get(async (_, res) => {
    try {
      const db = await connection;
      const posts_ = await db.all<PostDB[]>("select * from post order by created_at");
      const posts = await Promise.all(posts_.map(toPost));
      res.status(200).json(posts);

    } catch (e) {
      res.status(400).json({
        msg: "error",
        info: `${e}`
      })
    }
  });

///! all posts
app.route('/posts')
  .get(async (_, res) => {
    try {
      const db = await connection;
      const posts_ = await db.all<PostDB[]>("select * from post");
      const posts = await Promise.all(posts_.map(toPost));
      res.status(200).json(posts);
    } catch (e) {
      res.status(400).json({
        msg: "error",
        info: `${e}`
      })
    }
  });


///! echo back
app.route('/posts/:id')
  .get(async (req, res) => {
    const params = req.params;
    const id: number = Number.parseInt(params.id);

    try {
      const db = await connection;
      const post_ = await db.get<PostDB>("select * from post where post_id = ?", id);
      const post = toPost(post_ as PostDB);
      res.status(200).json(post);
    } catch (e) {
      res.status(400).json({
        msg: "error",
        info: `${e}`
      })
    }
  })


///! upload new post.
app.route('/posts')
  .put(async (req, res) => {

    try {
      const db = await connection;
      console.log(`${JSON.stringify(req.body)}`);

    } catch (e) {
      res.status(400).json({
        msg: "error",
        info: `${e}`
      })
    }
  });

///! put new post
app.route('/posts/:id/:parent_id')
  .put((req, res) => {
    const params = req.params;
    res.send(`PUT place holder ${JSON.stringify(params)}`);
  });

///! req.body: User
app.route('/users')
  .post(async (req, res) => {
    // TODO
    const db = await connection;
    const u = (req.body as User);
    console.log(JSON.stringify(u));
    const u1 = await db.get<User>("select name, password from user where user_id = ?", u.user_id);

    if (u1 && u1.password == u.password) {
    }

    (req.body as Pick<User, 'name' | 'password'>).name;
    res.send("users");
  });

app.listen(PORT, () => {
  process_init_message();
  process.on('beforeExit', async () => {
    const db = await connection;
    await db.close();
  });

});

app.use('/test', testRouter);

const process_init_message = () => {
  console.log(`[Server]: server is running in http://localhost:${PORT}`);
  console.log(`[Server]: server environment: `);
  console.log(`[Server]: __dirname: ${__dirname}`);
  console.log(`[Server]: process.cwd(): ${process.cwd()}`);
};
