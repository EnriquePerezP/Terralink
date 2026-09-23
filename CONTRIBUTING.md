# Guía de contribución — Terralink

¡Gracias por tu interés en contribuir a Terralink! Toda ayuda es bienvenida: reportes de errores, ideas, documentación o código.

## 🐛 Reportar errores

1. Revisa primero que no exista un [issue](https://github.com/EnriquePerezP/Terralink/issues) similar.
2. Crea un issue nuevo describiendo:
   - Qué esperabas que pasara y qué pasó en realidad.
   - Pasos para reproducir el problema.
   - Tu sistema operativo, versión de Node.js y dispositivo GPS utilizado.
   - Mensajes de error de la consola (si los hay).

## 💡 Proponer mejoras

Abre un issue con la etiqueta de sugerencia describiendo la funcionalidad que te gustaría ver y por qué sería útil.

## 🔀 Enviar Pull Requests

1. Haz un **fork** del repositorio.
2. Crea una rama para tu cambio:

   ```bash
   git checkout -b mi-mejora
   ```

3. Realiza tus cambios siguiendo el estilo del código existente (comentarios en español, código simple y legible).
4. Verifica que el servidor siga funcionando:

   ```bash
   npm start
   ```

5. Haz commit con un mensaje claro y descriptivo:

   ```bash
   git commit -m "Agrega filtro de coordenadas duplicadas"
   ```

6. Envía tu rama y abre un **Pull Request** describiendo qué hace tu cambio.

## 📏 Reglas básicas

- Mantén los cambios pequeños y enfocados: un PR = una mejora.
- No modifiques la lógica existente sin justificación.
- Documenta en el README cualquier cambio que afecte la instalación, configuración o uso.
- Sé respetuoso en issues y discusiones.

---

Al contribuir, aceptas que tus aportaciones se distribuyan bajo la misma [licencia MIT](LICENSE) del proyecto.
