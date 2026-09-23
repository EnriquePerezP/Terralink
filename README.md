# Terralink v1 — Public Release

![Versión](https://img.shields.io/badge/versión-1.0.0-blue)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen)
![Estado](https://img.shields.io/badge/estado-versión%20pública%20inicial-orange)


**Terralink** es un sistema de geolocalización para animales que funciona sin internet, utilizando tecnología de comunicación inalámbrica. Permite conocer la ubicación de los animales en tiempo real.
Lee coordenadas desde un dispositivo conectado por puerto serial (por ejemplo, un módulo GPS/LoRa con un microcontrolador como ESP32 o Arduino) y las visualiza al instante en un mapa web interactivo, mostrando la posición actual, la ruta recorrida y la calidad de la señal.

> 📢 **Sobre esta versión:** Este repositorio contiene la **primera versión pública** de Terralink, el sitio con el que inició el proyecto. Actualmente se está desarrollando una nueva versión renovada (en privado por el momento). Esta versión se libera como registro público del proyecto y para que cualquiera pueda usarla, estudiarla y mejorarla.

---

## 📋 Tabla de contenidos

- [Terralink v1 — Public Release](#terralink-v1--public-release)
  - [📋 Tabla de contenidos](#-tabla-de-contenidos)
  - [✨ Características](#-características)
  - [🔧 Cómo funciona](#-cómo-funciona)
  - [📦 Requisitos](#-requisitos)
  - [🚀 Instalación](#-instalación)
  - [⚙️ Configuración](#️-configuración)
  - [▶️ Uso](#️-uso)
  - [📡 Formato de datos](#-formato-de-datos)
  - [📁 Estructura del proyecto](#-estructura-del-proyecto)
  - [🛠️ Tecnologías utilizadas](#️-tecnologías-utilizadas)
  - [🔍 Solución de problemas](#-solución-de-problemas)
  - [🤝 Contribuir](#-contribuir)
  - [📄 Licencia](#-licencia)
  - [👤 Autor](#-autor)

---

## ✨ Características

- 🗺️ **Mapa en tiempo real** con Leaflet y OpenStreetMap.
- 📍 **Marcador en vivo** que sigue la posición del dispositivo GPS.
- 📈 **Línea de ruta** que dibuja el recorrido completo de la sesión.
- 📊 **HUD informativo** con latitud, longitud, hora de última actualización y calidad de señal (RSSI).
- 🛡️ **Filtros inteligentes**: ignora coordenadas vacías (0,0) y saltos de GPS erróneos mayores a 50 metros.
- ⚡ **Comunicación instantánea** entre el hardware y el navegador mediante Socket.IO (WebSockets).
- 🔌 **Lectura de puerto serial** con reconexión sencilla y parseo de datos en formato JSON.

## 🔧 Cómo funciona

```
┌──────────────────┐      ┌───────────────────┐       ┌──────────────────┐
│  Dispositivo GPS │      │  Servidor Node.js │       │  Navegador web   │
│  (ESP32/Arduino  │ USB  │  Express +        │ WS    │  Leaflet +       │
│   + módulo GPS)  │─────▶│  SerialPort +     │─────▶│  Socket.IO       │
│                  │JSON  │  Socket.IO        │       │  (mapa en vivo)  │
└──────────────────┘      └───────────────────┘       └──────────────────┘
```

1. El dispositivo GPS envía coordenadas en formato **JSON por el puerto serial** (una por línea).
2. El servidor Node.js lee el puerto serial con `serialport` y parsea cada línea.
3. Cada coordenada válida se transmite a todos los clientes conectados vía **Socket.IO**.
4. El navegador actualiza el marcador, dibuja la ruta y refresca el HUD en tiempo real.

## 📦 Requisitos

- **Node.js** 18 o superior ([descargar aquí](https://nodejs.org/)).
- Un **dispositivo que envíe datos GPS por serial** en formato JSON (ver [Formato de datos](#-formato-de-datos)), por ejemplo:
  - ESP32 / Arduino + módulo GPS (NEO-6M, NEO-M8N, etc.)
  - Un nodo LoRa con GPS (como el caso de uso original de Terralink).
- Conexión a internet (para cargar los tiles del mapa de OpenStreetMap y las librerías de Leaflet desde CDN).

## 🚀 Instalación

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/EnriquePerezP/Terralink.git
   cd Terralink
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

   > ⚠️ **Nota:** `serialport` es un módulo nativo. En Windows puede requerir las herramientas de compilación de Visual Studio; en la mayoría de los casos `npm install` descarga binarios precompilados automáticamente.

## ⚙️ Configuración

Abre `server.js` y ajusta el puerto serial y la velocidad según tu dispositivo:

```js
const port = new SerialPort({
  path: "COM6",      // 👈 Cambia por tu puerto: "COM3", "COM5", "/dev/ttyUSB0", etc.
  baudRate: 115200,  // 👈 Debe coincidir con el baudrate de tu dispositivo
});
```

**¿Cómo saber qué puerto usar?**

- **Windows:** abre el *Administrador de dispositivos* → sección *Puertos (COM y LPT)*.
- **Linux/macOS:** ejecuta `ls /dev/tty*` y busca algo como `/dev/ttyUSB0` o `/dev/ttyACM0`.

También puedes listar los puertos disponibles con este comando una vez instaladas las dependencias:

```bash
npx serialport-list
```

## ▶️ Uso

1. Conecta tu dispositivo GPS por USB.
2. Inicia el servidor:

   ```bash
   npm start
   ```

3. Abre tu navegador en:

   ```
   http://localhost:3000
   ```

4. ¡Listo! Verás el mapa centrado y, en cuanto el GPS obtenga señal, el marcador comenzará a moverse y la ruta se dibujará automáticamente.

## 📡 Formato de datos

El dispositivo debe enviar **un objeto JSON por línea** (terminado en `\r\n`) a través del puerto serial:

```json
{"lat": 17.111401, "lng": -96.757278, "rssi": -72}
```

| Campo  | Tipo   | Requerido | Descripción                                          |
|--------|--------|-----------|------------------------------------------------------|
| `lat`  | number | ✅ Sí     | Latitud en grados decimales.                          |
| `lng`  | number | ✅ Sí     | Longitud en grados decimales.                         |
| `rssi` | number | ❌ No     | Intensidad de señal en dBm (para el indicador del HUD). |

**Ejemplo de firmware (Arduino/ESP32):**

```cpp
Serial.print("{\"lat\":");
Serial.print(gps.location.lat(), 6);
Serial.print(",\"lng\":");
Serial.print(gps.location.lng(), 6);
Serial.print(",\"rssi\":");
Serial.print(LoRa.packetRssi());
Serial.println("}");
```

**Notas:**

- Las coordenadas `0,0` se ignoran automáticamente (se consideran "sin señal de satélite").
- Los saltos mayores a 50 metros entre lecturas consecutivas se descartan como errores del GPS.
- Si no envías `rssi`, el HUD mostrará "Activa 🟢" por defecto.

## 📁 Estructura del proyecto

```
Terralink/
├── public/
│   └── index.html      # Frontend: mapa Leaflet, HUD y lógica Socket.IO
├── server.js           # Servidor: Express + SerialPort + Socket.IO
├── package.json        # Dependencias y metadatos del proyecto
├── .gitignore
├── LICENSE             # Licencia MIT
├── CONTRIBUTING.md     # Guía para contribuir
└── README.md           # Este archivo
```

## 🛠️ Tecnologías utilizadas

| Componente | Tecnología |
|------------|------------|
| Backend    | Node.js, Express 5 |
| Tiempo real | Socket.IO |
| Puerto serial | serialport + @serialport/parser-readline |
| Mapas      | Leaflet + OpenStreetMap |
| Frontend   | HTML, CSS y JavaScript (sin frameworks) |

## 🔍 Solución de problemas

| Problema | Posible solución |
|----------|------------------|
| `Error: Opening COM6: File not found` | El puerto no existe o el dispositivo no está conectado. Verifica el puerto correcto en el Administrador de dispositivos. |
| `Error: Opening COM6: Access denied` | Otro programa está usando el puerto (Arduino IDE, monitor serial, etc.). Ciérralo e intenta de nuevo. |
| `Error JSON: ...` en consola | El dispositivo está enviando texto que no es JSON válido. Revisa el [formato de datos](#-formato-de-datos). |
| El mapa se ve pero el marcador no se mueve | El GPS aún no tiene señal de satélite (sal a un lugar despejado) o las coordenadas llegan como `0,0`. |
| El mapa no carga (pantalla gris) | Sin conexión a internet: los tiles de OpenStreetMap y Leaflet se cargan desde CDN. |

## 🤝 Contribuir

Las contribuciones son bienvenidas. Revisa la [guía de contribución](CONTRIBUTING.md) para más detalles. También puedes:

- 🐛 Reportar errores en [Issues](https://github.com/EnriquePerezP/Terralink/issues).
- 💡 Proponer nuevas funcionalidades.
- 🔀 Enviar Pull Requests con mejoras.

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más información.

Esto significa que puedes usar, copiar, modificar y distribuir este software libremente, incluso con fines comerciales, siempre que incluyas el aviso de copyright original.

## 👤 Autor

**Enrique Perez**

- GitHub: [@EnriquePerezP](https://github.com/EnriquePerezP)

---

⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub. ¡Gracias!
