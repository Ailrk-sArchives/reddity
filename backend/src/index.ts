import express from "express";
import {testRouter} from './test';

const app = express()
const PORT = 8080

// test router
app.use('/test', testRouter);

///! index
app.route('/')
  .get((_, res) => {
    res.send("TESTING")
  });

///! List of posts sorted by date
app.route('/popular')
  .get((_, res) => {
    res.send('hot');

  });

///! List of posts sorted by date
app.route('/new')
  .get((_, res) => {
    res.send('new');
  })

///! get a post
app.route('/posts/:id')
  .get((req, res) => {
    const params = req.params;
    res.send(`GET place holder ${JSON.stringify(params)}`);
  })
  .post((req, res) => {
    const params = req.params;
    res.send(`POST place holder ${JSON.stringify(params)}`);
  })
  .put((_, res, next) => {
    res.send(`PUT`);
    next();
  });

app.route('posts/:id/:parent_id')
  .put((req, res) => {
    const params = req.params;
    res.send(`PUT place holder ${JSON.stringify(params)}`);
  });

app.route('users')
  .post((_, res) => {
    res.send("users");
  });


app.listen(PORT, () => {
  process_init_message();
});

const process_init_message = () => {
  console.log(`[Server]: server is running in http://localhost:${PORT}`);
  console.log(`[Server]: server environment: `);
  console.log(`[Server]: __dirname: ${__dirname}`);
  console.log(`[Server]: process.cwd(): ${process.cwd()}`);
};
