import express from "express";
import {testRouter} from "./test";
import {loggerMW, requestTimeMW} from "./middlewares";
import {connection, User, Post, Reply, PostDB, toPost} from "./model";

const cors = require("cors");
const app = express()
const PORT = 8080


app.use(cors());
app.use(requestTimeMW);
app.use(loggerMW);
app.use(express.json());


///! index
app.route('/')
  .get((_, res) => {
    res.send("TESTING")
  });

///! signup new users
app.route('/signup')
  .post(async (req, res) => {
    const {name, password, email, avatar} = req.body as {
      name: string,
      password: string  // hash from the client side
      email?: string
      avatar?: string
    };

    try {
      const db = await connection;

      if (avatar) {
        await db.run(`
          insert into user (name, password, email, avatar)
                  values (?, ?, ?, ?)
          `,
          name,
          password,
          email,
          Buffer.from(avatar, "base64")
        );
      } else {
        await db.run(`
          insert into user (name, password, email)
                  values (?, ?, ?)
          `,
          name,
          password,
          email
        );
      }

      res.status(200).json({
        msg: "ok",
        detail: "signed up"
      });

    } catch (e) {
      res.status(400).json({
        msg: "error",
        detail: `${e}`
      })
    }
  });


///! login
app.route('/login/:name')
  .post(async (req, res) => {
    try {
      const db = await connection;
      const u = (req.body as User);
      const u_ = await db.get<User>(`
      select name, password from user where user_id = ?
    `, u.user_id);
      if (u_ && u_.password == u.password) {
        res.status(200).json(req.body);
      } else {
        res.status(400).json({
          msg: "we are expecting somethig different",
          detail: "wrong password"
        });
      }

    } catch (e) {
      res.status(400).json({
        msg: "error",
        detail: `${e}`
      })
    }
  })

///! List of posts sorted by popularities
app.route('/popular')
  .get(async (_, res) => {
    try {
      const db = await connection;
      const posts_ = await db.all<PostDB[]>(`
        select * from post order by score desc
      `);
      const posts = await Promise.all(posts_.map(toPost));
      res.status(200).json(posts);

    } catch (e) {
      res.status(400).json({
        msg: "error",
        detail: `${e}`
      })
    }

  });

///! List of posts sorted by date
app.route('/new')
  .get(async (_, res) => {
    try {
      const db = await connection;
      const posts_ = await db.all<PostDB[]>(`
        select * from post order by created_at
      `);
      const posts = await Promise.all(posts_.map(toPost));
      res.status(200).json(posts);

    } catch (e) {
      res.status(400).json({
        msg: "error",
        detail: `${e}`
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
        detail: `${e}`
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
      const post_ = await db.get<PostDB>(`
        select * from post where post_id = ?
     `, id);
      const post = await toPost(post_ as PostDB);
      res.status(200).json(post);
    } catch (e) {
      res.status(400).json({
        msg: "error",
        detail: `${e}`
      })
    }
  })


///! upload new post.
app.route('/posts')
  .put(async (req, res) => {

    try {
      const db = await connection;
      const p = req.body as Omit<Post, 'post_id' | 'replies'>;
      p.created_at = new Date().toJSON();
      p.score = 0;
      const author = await db.get<User>(`
        select * from user where name = ?
        `, p.author);

      await db.run(`
        insert into post ( author_id
                         , title
                         , content
                         , created_at
                         , score
                         )
               values(?, ?, ?, ?, ?)
      `,
        author?.user_id as number,
        p.title,
        p.content,
        p.created_at,
        p.score
      )
      res.status(200).json({
        msg: "ok",
        detail: "pushed new post"
      });

    } catch (e) {
      res.status(400).json({
        msg: "error",
        detail: `${e}`
      })
    }
  });

app.route('/posts/:id/')
  .put(async (req, res) => {
    const {id} = req.params as {
      id: string,
    };

    const r = req.body as Omit<Reply, | 'reply_id' | 'replies'>;
    try {
      const db = await connection;
      const author = await db.get<User>(`
        select * from user where name = ?
        `, r.author);

      r.created_at = new Date().toJSON();
      r.score = 0;

      await db.run(`
        insert into reply ( author_id
                          , post_id
                          , body
                          , score
                          , created_at
                          )
                values(?, ?, ?, ?, ?)
        `,
        author?.user_id as number,
        id,
        r.body,
        r.score,
        r.created_at);

      res.status(200).json({
        msg: "ok",
        detail: "pushed new top level reply"
      });
    } catch (e) {
      res.status(400).json({
        msg: "error",
        detail: `${e}`
      })
    }
  });

///! put new post
app.route('/posts/:id/:parent_id')
  .put(async (req, res) => {
    {
      const {id, parent_id} = req.params as {
        id: string,
        parent_id: string,
      };

      const r = req.body as Omit<Reply, 'reply_id' | 'replies'>;
      try {
        const db = await connection;
        const author = await db.get<User>(`
        select * from user where name = ?
        `, r.author);

        r.created_at = new Date().toJSON();
        r.score = 0;

        await db.run(`
          insert into reply ( author_id
                            , post_id
                            , root_reply_id
                            , body
                            , score
                            , created_at
                            )
                  values(?, ?, ?, ?, ?, ?)
          `,
          author?.user_id as number,
          id,
          parent_id,
          r.body,
          r.score,
          r.created_at);

        res.status(200).json({
          msg: "ok",
          detail: "pushed new nested reply"
        });
      } catch (e) {
        res.status(400).json({
          msg: "error",
          detail: `${e}`
        })
      }
    }

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
