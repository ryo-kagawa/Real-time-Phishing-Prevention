import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT;
const key = Buffer.from("localhost:3000/00000000000000000");
const iv = Buffer.from("0000000000000000");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    const filePath = path.join(__dirname, "site/index.html");
    fs.readFile(filePath, "utf-8", (err, data) => {
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end(data);
      return;
    });
  }
  if (req.url === "/favicon.ico") {
    res.writeHead(404);
    res.end();
  }
  if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const encrypted = Buffer.from(body, "base64");
      const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
      decipher.on("error", (error) => {
        console.log(error)
        res.writeHead(401);
        res.end("Authentication failed");
        return;
      });
      let decrypted = decipher.update(encrypted, undefined, "utf8");
      try {
        decrypted += decipher.final("utf8");
      } catch(error) {
        console.log(error);
        res.writeHead(401);
        res.end("Authentication failed");
        return;
      }
      const data = JSON.parse(decrypted);
      if(data.ID === "test" && data.PW === "password") {
        res.writeHead(200);
        res.end("Authentication success");
        return;
      }
      res.writeHead(401);
      res.end("Authentication failed");
      return;
    })
  }
});

server.listen(port);
