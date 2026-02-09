# 🧙‍♂️ PyDungeon: Aprende Python Jugando

Una aventura interactiva donde **la magia es el código**. PyDungeon enseña lógica de programación a niños y principiantes mediante una experiencia RPG inmersiva que se ejecuta 100% en el navegador.

---

## ✨ Características Principales

PyDungeon no es solo un editor de texto; es un **entorno de simulación completo** donde cada línea de código tiene un impacto visual inmediato.

### 🗺️ Niveles Progresivos & Gameplay
Desde movimientos básicos hasta bucles `for`, condicionales `if/else` y lógica de física. Cada nivel introduce un concepto nuevo de forma orgánica, sin muros de texto teóricos.

### 📖 El Grimorio (Sistema de Ayuda)
Un compendio interactivo de comandos. Diseñado pedagógicamente para enseñar sintaxis correcta, indentación y el uso de funciones sin abrumar al estudiante.

### 🛠️ Dev Mode & Motor de Física
Para los curiosos y educadores. El juego incluye un modo de depuración visual y un motor de física personalizado que permite resolver puzzles de gravedad mediante código real.

---

## 🚀 Tecnología "Bajo el Capó"

Lo que hace especial a este proyecto es que **no requiere backend para ejecutar Python**. Todo sucede en el cliente.

- **Pyodide (WebAssembly)**: Ejecutamos un intérprete de Python completo dentro del navegador. Esto garantiza seguridad (sandbox) y velocidad instantánea, permitiendo importar librerías estándar si fuera necesario.

- **React + Zustand**: Gestión de estado global optimizada para sincronizar la ejecución asíncrona del código Python con las animaciones del Grid y el Canvas a 60 FPS.

- **CodeMirror 6**: Editor de código profesional con resaltado de sintaxis Python y autocompletado básico.

- **Diseño Sonoro**: Sistema de audio inmersivo (BGM y SFX) implementado con `use-sound` para feedback táctil y auditivo.

---

## 🎮 Instalación y Uso Local

¿Quieres probarlo, modificar los niveles o contribuir? Sigue estos pasos para correrlo en tu máquina:

```bash
# 1. Clona el repositorio
git clone https://github.com/TU_USUARIO/PyDungeon.git

# 2. Entra al directorio
cd PyDungeon

# 3. Instala las dependencias
npm install

# 4. Inicia el servidor de desarrollo
npm run dev
```

Abre tu navegador en `http://localhost:5173` y ¡empieza a lanzar hechizos!

---

## 📚 Estructura del Proyecto

```
src/
├── components/   # UI Reutilizable (GameGrid, CodeEditor, OutputConsole)
├── data/         # Definición de Niveles y Misiones (JSON/TS)
├── hooks/        # Lógica de Pyodide (usePyodide.ts - El cerebro)
├── store/        # Estado Global (Zustand - useGameStore)
└── assets/       # Imágenes y Sonidos
```

---

## 👨‍💻 Autor

Desarrollado con 🧡 y mucho café.

[LinkedIn](#) | [Portfolio](#)
