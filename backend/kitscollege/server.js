const http = require("http");
const fs = require("fs");
const url = require("url");

const PORT = 3000;
const DB_PATH = "./db.json";

// Helper function to read db.json
function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

// Helper function to write to db.json
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Only handle /data path
  if (parsedUrl.pathname === "/data") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      res.setHeader("Content-Type", "application/json");

      if (req.method === "GET") {
        const data = readDB();
        res.writeHead(200);
        res.end(JSON.stringify(data));

      } else if (req.method === "POST") {
        const newData = JSON.parse(body);
        writeDB(newData);
        res.writeHead(201);
        res.end(JSON.stringify({ message: "Data created", data: newData }));

      } else if (req.method === "PUT") {
        const updateData = JSON.parse(body);
        writeDB(updateData);
        res.writeHead(200);
        res.end(JSON.stringify({ message: "Data updated", data: updateData }));

      } else if (req.method === "DELETE") {
        writeDB({});
        res.writeHead(200);
        res.end(JSON.stringify({ message: "Data deleted" }));

      } else {
        res.writeHead(405);
        res.end(JSON.stringify({ error: "Method Not Allowed" }));
      }
    });

  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});