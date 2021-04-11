import express from "express";
import {testRouter} from "./test";
import {loggerMW, requestTimeMW} from "./middlewares";
import {connection, APITypes, User, Post, Reply} from "./model";

const app = express()
const PORT = 8080


app.use(requestTimeMW);
app.use(loggerMW);


///! index
app.route('/')
  .get((_, res) => {
    res.send("TESTING")
  });

app.route('/login/:name')
  .post(async (req, res) => {
    console.log("good");
    console.log(req);
    const db = await connection;
    // const u = (req.body as User);
    // const u1 = await db.get<User>("select name, password where user_id = ?", u.user_id);
    // if (u1 && u1.password == u.password) {
    // }
    res.send("back");
  })

///! List of posts sorted by date
app.route('/popular')
  .get((_, res) => {
    res.send('hot');
  });

///! List of posts sorted by date
app.route('/new')
  .get((_, res) => {
    res.send('new');
  });

///! get a post
app.route('/posts/:id')
  .get((req, res) => {
    const params = req.params;
    res.send(`GET place holder ${JSON.stringify(params)}`);
  })
  .post((req, res) => {
    const params = req.params;
    res.send(`POST place holder ${JSON.stringify(params)}`);
  });

app.route('/posts/:id/:parent_id')
  .put((req, res) => {
    const params = req.params;
    res.send(`PUT place holder ${JSON.stringify(params)}`);
  });

app.route('/users')
  .post((req, res) => {
    // TODO
    (req.body as Pick<User, 'name' | 'password'>).name;
    res.send("users");
  });


app.listen(PORT, () => {
  process_init_message();
});

app.use('/test', testRouter);

const process_init_message = () => {
  console.log(`[Server]: server is running in http://localhost:${PORT}`);
  console.log(`[Server]: server environment: `);
  console.log(`[Server]: __dirname: ${__dirname}`);
  console.log(`[Server]: process.cwd(): ${process.cwd()}`);
};
