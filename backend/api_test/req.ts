import http from 'http';
import assert from 'assert';


const readAll = (path: string, method: string) =>
  (end: (buf: Buffer) => void) =>
    (res: http.IncomingMessage) => {
      let chunks: Uint8Array[] = [];

      res.on('readable', () => {
        let chunk: Uint8Array;
        while ((chunk = res.read()) !== null) {
          chunks.push(chunk);
        }
      });

      res.on('end', () => {
        console.log("===================");
        console.log(`>> ${path} ${method}`);
        const buf = Buffer.concat(chunks);
        end(buf);
      });
    };


const fetch = (options: http.RequestOptions & {body?: string}, end: (buf: Buffer) => void) => {
  const headers = options.body ? {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(options.body)
  } : undefined;

  const req = http.request({
    hostname: 'localhost',
    port: '8080',
    ...options,
    headers,
  }, res => readAll(options.path as string, options.method as string)(end)(res));

  req.on('error', console.error);
  if (options.body) {
    req.write(options.body);
  }

};

fetch({
  path: "/login/test", method: "POST", body: JSON.stringify({
    user_id: 1,
    user_name: "test",
    password: 123
  })
}, buf => {
  const result = buf.toString('utf8');
  console.log(result);
  // assert(result === "TESTING", "assert failed");
});

// fetch({path: "/", method: "GET"}, buf => {
//   const result = buf.toString('utf8');
//   console.log(result);
//   assert(result === "TESTING", "assert failed");
// });

// fetch({path: "/popular", method: "GET"}, buf => {
//   const result = buf.toString('utf8');
//   console.log(result);
//   // assert(result === "TESTING", "assert failed");
// })

// fetch({path: "/new", method: "GET"}, buf => {
//   const result = buf.toString('utf8');
//   console.log(result);
//   // assert(result === "TESTING", "assert failed");
// })

// fetch({path: "/POST/1", method: "GET"}, buf => {
//   const result = buf.toString('utf8');
//   console.log(result);
//   // assert(result === "TESTING", "assert failed");
// })

// fetch({path: "/POST/1", method: "POST"}, buf => {
//   const result = buf.toString('utf8');
//   console.log(result);
//   // assert(result === "TESTING", "assert failed");
// })

// fetch({path: "/POST/1", method: "PUT"}, buf => {
//   const result = buf.toString('utf8');
//   console.log(result);
//   // assert(result === "TESTING", "assert failed");
// })

// fetch({path: "POST/1/1", method: "PUT"}, buf => {
//   const result = buf.toString('utf8');
//   console.log(result);
//   // assert(result === "TESTING", "assert failed");
// })
