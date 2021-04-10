import express from "express";

const app = express()
const PORT = 8080

app.get('/', (_, res) => {
  res.send("TESTING")
})

app.post('/', (req, res) => {
  console.log(req)
  res.send('TESTING POST')
})

app.listen(PORT, () => {
  console.log(`[Server]: server is running in http://localhost:${PORT}`);
});


