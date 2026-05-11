const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// =====================
// Servir frontend
// =====================
app.use(express.static("public"));

// =====================
// Configurar Serial
// =====================
const port = new SerialPort({
  path: "COM6",
  baudRate: 115200,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

console.log("Leyendo GPS desde COM6...");

// =====================
// Leer datos seriales
// =====================
parser.on("data", (line) => {

  try {

    const data = JSON.parse(line);

    console.log("GPS:", data);

    // Enviar a clientes web
    io.emit("gps-update", data);

  } catch (err) {

    console.log("Error JSON:", line);

  }

});

// =====================
// Conexión web
// =====================
io.on("connection", (socket) => {

  console.log("Cliente web conectado");

});

// =====================
// Iniciar servidor
// =====================
server.listen(3000, () => {

  console.log("Servidor en http://localhost:3000");

});