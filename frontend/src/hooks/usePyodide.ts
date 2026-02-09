import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

declare global {
    interface Window {
        loadPyodide: any;
    }
}

declare global {
    interface Window {
        loadPyodide: any;
    }
}

export const usePyodide = () => {
    const [pyodide, setPyodide] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    // const [output, setOutput] = useState<string[]>([]); // Removed local state
    const outputRef = useRef<string[]>([]); // Ref to keep track of current output during execution if needed, though state is fine for React updates

    const { addCommand, clearQueue, level, output, addToOutput, clearOutput } = useGameStore();

    useEffect(() => {
        // Expose a function to global window for Pyodide to call
        (window as any).game_dispatch = (command: string) => {
            addCommand(command);
        };
    }, []);

    useEffect(() => {
        const loadScript = async () => {
            if (window.loadPyodide) {
                initializePyodide();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
            script.async = true;
            script.onload = () => initializePyodide();
            document.body.appendChild(script);
        };

        const initializePyodide = async () => {
            try {
                const py = await window.loadPyodide({
                    stdout: (text: string) => {
                        outputRef.current.push(text);
                        // setOutput((prev) => [...prev, text]);
                        addToOutput(text);
                    },
                    stderr: (text: string) => {
                        const err = `Error: ${text}`;
                        outputRef.current.push(err);
                        // setOutput((prev) => [...prev, err]);
                        addToOutput(err);
                    }
                });
                setPyodide(py);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to load Pyodide", error);
                setIsLoading(false);
            }
        };

        loadScript();
    }, []);

    const runPython = async (code: string) => {
        if (!pyodide) return;

        // 1. PREPARACIÓN (Limpieza)
        setIsRunning(true);
        // setOutput([]); // Limpiar consola
        clearOutput();
        outputRef.current = [];
        clearQueue(); // Limpiar comandos pendientes

        // SOLO limpiamos los frames de animación anteriores, NO los objetos.
        useGameStore.getState().setReplayFrames([], undefined);

        try {
            // Prepare data for Python
            const { walls, entities, heroPosition } = useGameStore.getState();
            const gridSize = 10;
            const wallsJson = JSON.stringify(walls);
            const entitiesJson = JSON.stringify(entities);
            const heroPosJson = JSON.stringify(heroPosition);

            // Python setup code to inject the Hero class
            const setupCode = `
import js
import json

# Load Game Data
try:
    walls_data = json.loads('${wallsJson}')
    entities_data = json.loads('${entitiesJson}')
    hero_pos = json.loads('${heroPosJson}')
except:
    walls_data = []
    entities_data = []
    hero_pos = {'x': 0, 'y': 0}

grid_size = ${gridSize}

class Hero:
    def __init__(self, x, y, walls, entities, size):
        self.x = x
        self.y = y
        self.walls = walls
        self.entities = entities
        self.size = size
        self.actions = []
        self.is_drawing = False

    def is_path_clear(self, direction):
        target_x, target_y = self.x, self.y
        direction = direction.lower()
        
        if direction == 'right': target_x += 1
        elif direction == 'left': target_x -= 1
        elif direction == 'up': target_y -= 1
        elif direction == 'down': target_y += 1
        
        # Check bounds
        if target_x < 0 or target_x >= self.size or target_y < 0 or target_y >= self.size:
            return False
            
        # Check walls
        for w in self.walls:
            if w[0] == target_x and w[1] == target_y:
                return False
        return True

    def is_item_here(self):
        for e in self.entities:
            if e['pos'][0] == self.x and e['pos'][1] == self.y:
                return True
        return False

    def _move(self, direction):
        # Update internal position for simulation
        if direction == 'RIGHT': self.x += 1
        elif direction == 'LEFT': self.x -= 1
        elif direction == 'UP': self.y -= 1
        elif direction == 'DOWN': self.y += 1

        action = {'type': 'MOVE', 'direction': direction}
        if self.is_drawing:
            action['paint'] = True
        self.actions.append(action)
        print(f"Hero moves {direction.lower()} " + ("🖌️" if self.is_drawing else "👉"))

    def move_right(self): self._move('RIGHT')
    def move_left(self): self._move('LEFT')
    def move_up(self): self._move('UP')
    def move_down(self): self._move('DOWN')

    def say(self, message):
        self.actions.append({'type': 'SAY', 'payload': str(message)})
        print(f"Hero says: {message} 🗣️")

    def collect(self):
        # Remove item from internal list so subsequent checks fail (simulating collection)
        for i, e in enumerate(self.entities):
            if e['pos'][0] == self.x and e['pos'][1] == self.y:
                self.entities.pop(i)
                break
        
        self.actions.append({'type': 'COLLECT'})
        print("Hero collects item 💎")

    def unlock(self):
        self.actions.append({'type': 'UNLOCK'})
        print("Hero unlocks obstacle 🔓")

    def summon(self, entity):
        # Extract attributes from entity object (handling Proxy)
        try:
            color = getattr(entity, 'color', 'gray')
        except:
            color = 'gray'
            
        try:
            strength = getattr(entity, 'strength', 0)
        except:
            strength = 0

        self.actions.append({'type': 'SUMMON', 'payload': {'color': color, 'strength': strength}})
        print(f"Hero summons Golem! (Color: {color}, Strength: {strength}) 🤖")

    def pen_down(self):
        self.is_drawing = True
        self.actions.append({'type': 'PEN_DOWN'})
        print("Hero lowers pen 🖊️")
        
    def pen_up(self):
        self.is_drawing = False
        self.actions.append({'type': 'PEN_UP'})
        print("Hero lifts pen 👆")
        
    def set_color(self, color):
        self.actions.append({'type': 'SET_COLOR', 'payload': str(color)})
        print(f"Hero sets pen color to {color} 🎨")

class MagicTK:
    def __init__(self):
        self.actions = []

    def create_button(self, text, callback_name, x=100, y=100, color=None):
        cb = callback_name
        if callable(callback_name):
            cb = callback_name.__name__
            
        action = {
            'type': 'CREATE_BUTTON',
            'text': text,
            'callback': cb,
            'x': x,
            'y': y,
            'id': 'btn_' + str(len(self.actions))
        }
        if color:
            action['color'] = color
            
        self.actions.append(action)
        print(f"GUI: Button '{text}' created at ({x},{y})")

    def create_rect(self, x, y, color):
        import uuid
        obj_id = str(uuid.uuid4())[:8]
        self.actions.append({
            'type': 'DRAW_RECT',
            'id': obj_id,
            'x': x,
            'y': y,
            'color': color,
            'width': 50,
            'height': 50
        })
        print(f"GUI: Rect created at ({x},{y})")
        return obj_id

    def move(self, object_id, x, y):
        self.actions.append({
            'type': 'MOVE_OBJECT',
            'id': object_id,
            'dx': x,
            'dy': y
        })

hero = Hero(hero_pos['x'], hero_pos['y'], walls_data, entities_data, grid_size)
gui = MagicTK()
`;

            // 2. EJECUCIÓN
            // Determine Simulation Type based on Level
            const levelName = useGameStore.getState().level?.name;
            let levelSetupCode = '';
            let simulationLoopCode = '';

            if (levelName === 'Gravedad Artificial') {
                // 1. DEFINICIÓN DE CLASES (Solo Setup)
                levelSetupCode = `
import json
class Golem:
    def __init__(self):
        self.x = 0
        self.y = 0
        self.width = 30
        self.height = 30
        self.grounded = False

    def move(self, dx, dy):
        self.x += dx
        self.y += dy

# Plataformas SINCRONIZADAS con React
platforms = [
    {'x': 50, 'y': 150, 'w': 100, 'h': 10},
    {'x': 200, 'y': 280, 'w': 100, 'h': 10},
    {'x': 0, 'y': 400, 'w': 600, 'h': 20} # Floor
]

golem = Golem()
frames = []
won = False
`;

                // 2. CÓDIGO DE SIMULACIÓN (Para ejecutar AL FINAL)
                simulationLoopCode = `
# BUCLE DE SIMULACIÓN (Corre DESPUÉS del usuario)
print("🔮 Motor de Física: Calculando trayectoria...")
step_count = 0
for step in range(600):
    step_count += 1
    prev_feet_y = golem.y + golem.height

    # 1. Ejecutar gravedad del usuario
    try:
        if 'apply_gravity' in globals():
            apply_gravity(golem)
    except Exception as e:
        pass

    # 2. Movimiento Lateral (más rápido para alcanzar las plataformas)
    golem.x += 3

    # 3. Colisión Anti-Tunneling Perfecta
    golem.grounded = False
    curr_feet_y = golem.y + golem.height
    
    for p in platforms:
        # Si estamos dentro del ancho de la plataforma
        if golem.x + golem.width > p['x'] and golem.x < p['x'] + p['w']:
            # Si en este frame nuestros pies cruzaron la superficie (Sweep Test)
            if prev_feet_y <= p['y'] + 10 and curr_feet_y >= p['y']:
                golem.y = p['y'] - golem.height
                golem.grounded = True
                break

    frames.append({'golem': {'x': int(golem.x), 'y': int(golem.y)}})

    # Victoria si llega lejos caminando sobre las plataformas
    if golem.x > 300 and golem.grounded:
        won = True
        print("✨ ¡Cálculo exitoso! El Golem alcanzará su destino.")
        break
    
    if golem.y > 450: # Cayó al vacío
        break

json.dumps({'frames': frames, 'won': won})
`;
            }

            // Run base setup code first (Hero, MagicTK)
            await pyodide.runPythonAsync(setupCode);

            // Run Level Specific Setup (Gravedad Artificial)
            if (levelSetupCode) {
                await pyodide.runPythonAsync(levelSetupCode);
            }

            // Run User Code (defines apply_gravity or other logic)
            // We capture result here for normal levels
            let result = await pyodide.runPythonAsync(code);

            // Run Level Specific Simulation Loop (if applicable)
            if (simulationLoopCode && code.includes('apply_gravity')) {
                result = await pyodide.runPythonAsync(simulationLoopCode);
            }

            // --- FRAMES DETECTION ---
            if (result && typeof result === 'string' && result.includes('"frames"')) {
                // console.log("[Pyodide] Frames detected in result");
                addCommand(`GAME_LOOP_FRAMES:${result}`);
            }
            // ------------------------

            // Extract actions
            const actionsJson = await pyodide.runPythonAsync("json.dumps(hero.actions + gui.actions if 'gui' in globals() else hero.actions)");
            const actions = JSON.parse(actionsJson);

            // Process actions
            actions.forEach((action: any) => {
                if (action.type === 'MOVE') {
                    let cmd = `MOVE_${action.direction}`;
                    if (action.paint) {
                        cmd += ':PAINT';
                    }
                    addCommand(cmd);
                } else if (action.type === 'SAY') {
                    addCommand(`SAY:${action.payload}`);
                } else if (action.type === 'COLLECT') {
                    addCommand('COLLECT');
                } else if (action.type === 'UNLOCK') {
                    addCommand('UNLOCK');
                } else if (action.type === 'SUMMON') {
                    const payload = JSON.stringify(action.payload);
                    addCommand(`SUMMON:${payload}`);
                } else if (action.type === 'PEN_DOWN') {
                    addCommand('PEN_DOWN');
                } else if (action.type === 'PEN_UP') {
                    addCommand('PEN_UP');
                } else if (action.type === 'SET_COLOR') {
                    addCommand(`SET_COLOR:${action.payload}`);
                } else if (action.type === 'CREATE_BUTTON') {
                    const cmd = `CREATE_BUTTON:${JSON.stringify(action)}`;
                    addCommand(cmd);
                    // setOutput(prev => [...prev, `[System] Queued button: ${action.text}`]);
                    addToOutput(`[System] Queued button: ${action.text}`);
                } else if (action.type === 'DRAW_RECT') {
                    addCommand(`DRAW_RECT:${JSON.stringify(action)}`);
                    // setOutput(prev => [...prev, `[System] Queued rect`]);
                    addToOutput(`[System] Queued rect`);
                } else if (action.type === 'MOVE_OBJECT') {
                    addCommand(`MOVE_OBJECT:${JSON.stringify(action)}`);
                } else if (action.type === 'GAME_LOOP_FRAMES') {
                    // Casos especiales para Pong/Level 15
                    // Simplemente pasamos el comando si llega explícitamente en actions
                    // aunque usualmente vendrá por el canal lateral de simulación
                }
            });

            // Validate against Solution Criteria (Output Check, etc.)
            const currentLogs = outputRef.current;
            const fullOutput = currentLogs.join('\n').trim();

            if (level && level.solutionCriteria) {
                if (level.solutionCriteria.startsWith("output: ")) {
                    const expected = level.solutionCriteria.substring("output: ".length).trim();
                    if (fullOutput.includes(expected)) {
                        addCommand('UNLOCK');
                    }
                } else if (level.solutionCriteria.startsWith("summon_match: ")) {
                    const expectedJson = level.solutionCriteria.substring("summon_match: ".length).trim();
                    const summonAction = actions.find((a: any) => a.type === 'SUMMON');
                    if (summonAction) {
                        const { color, strength } = summonAction.payload;
                        const matchColor = expectedJson.includes(`"color": "${color}"`);
                        const matchStrength = expectedJson.includes(`"strength": ${strength}`);

                        if (matchColor && matchStrength) {
                            addCommand('UNLOCK');
                        }
                    }
                } else if (level.solutionCriteria.startsWith("painted_match: ")) {
                    const expectedJson = level.solutionCriteria.substring("painted_match: ".length).trim();
                    // Reconstruct painted cells from actions
                    const painted = new Set<string>();
                    try {
                        const initialPos = JSON.parse(heroPosJson);
                        let hx = initialPos.x;
                        let hy = initialPos.y;

                        actions.forEach((a: any) => {
                            if (a.type === 'MOVE') {
                                if (a.direction === 'RIGHT') hx++;
                                else if (a.direction === 'LEFT') hx--;
                                else if (a.direction === 'UP') hy--;
                                else if (a.direction === 'DOWN') hy++;

                                if (a.paint) painted.add(`${hx},${hy}`);
                            } else if (a.type === 'PEN_DOWN') {
                                painted.add(`${hx},${hy}`);
                            }
                        });

                        const expectedSet = new Set<string>();
                        const matches = expectedJson.matchAll(/\[(\d+),\s*(\d+)\]/g);
                        for (const m of matches) {
                            expectedSet.add(`${m[1]},${m[2]}`);
                        }

                        if (painted.size === expectedSet.size) {
                            const allMatch = [...painted].every(p => expectedSet.has(p));
                            if (allMatch) addCommand('UNLOCK');
                        }
                    } catch (e) {
                        console.error("Validation error", e);
                    }
                } else if (level.solutionCriteria.startsWith("target_cell: ")) {
                    const expected = level.solutionCriteria.substring("target_cell: ".length).trim();
                    try {
                        const initialPos = JSON.parse(heroPosJson);
                        let hx = initialPos.x;
                        let hy = initialPos.y;
                        actions.forEach((a: any) => {
                            if (a.type === 'MOVE') {
                                if (a.direction === 'RIGHT') hx++;
                                else if (a.direction === 'LEFT') hx--;
                                else if (a.direction === 'UP') hy--;
                                else if (a.direction === 'DOWN') hy++;
                            }
                        });
                        if (`${hx},${hy}` === expected) {
                            addCommand('UNLOCK');
                        }
                    } catch (e) { }
                } else if (level.solutionCriteria.startsWith("graphic_match: ")) {
                    // (Graphic match logic preserved but simplified or assumed handled by generic action check if needed, 
                    // but for brevity and focusing on user request, I'll rely on output/actions. 
                    // Actually, I should include it if it was there. Let's include it briefly.)
                    const expectedJson = level.solutionCriteria.substring("graphic_match: ".length).trim();
                    try {
                        const layout = JSON.parse(level.gridLayout);
                        let virtualObjects = Array.isArray(layout.canvasObjects) ? JSON.parse(JSON.stringify(layout.canvasObjects)) : [];
                        const objMap = new Map<string, any>();
                        virtualObjects.forEach((o: any) => objMap.set(o.id, o));
                        actions.forEach((a: any) => {
                            if (a.type === 'DRAW_RECT') {
                                const newObj = { ...a, type: 'RECT' };
                                objMap.set(a.id, newObj);
                            } else if (a.type === 'MOVE_OBJECT') {
                                const obj = objMap.get(a.id);
                                if (obj) {
                                    obj.x += (a.dx || 0);
                                    obj.y += (a.dy || 0);
                                }
                            }
                        });
                        const criteria = JSON.parse(expectedJson);
                        const targetObj = objMap.get(criteria.id);
                        if (targetObj) {
                            let match = true;
                            if (criteria.x !== undefined && targetObj.x !== criteria.x) match = false;
                            if (criteria.y !== undefined && targetObj.y !== criteria.y) match = false;
                            if (match) addCommand('UNLOCK');
                        }
                    } catch (e) { }
                }
            }

            // SI ES NIVEL SIMULADO (PONG/GOLEM), extraer frames explícitamente si no vinieron en actions
            // Esto es vital para Level 14/15
            if (code.includes('apply_gravity') || code.includes('update(')) {
                // Intentar recuperar el dump JSON final si el usuario no lo retornó explícitamente
                try {
                    const lastLineResult = await pyodide.runPythonAsync("_"); // Recuperar último resultado
                    if (typeof lastLineResult === 'string' && lastLineResult.includes('frames')) {
                        addCommand(`GAME_LOOP_FRAMES:${lastLineResult}`);
                    }
                } catch (e) { }
            }

            return result;
        } catch (error: any) {
            console.error("Python Error:", error);
            const errorMsg = error.message || "Unknown error";

            // Personalización de Errores para Niños
            let friendlyMsg = errorMsg;

            if (errorMsg.includes('SyntaxError')) {
                friendlyMsg = "¡El hechizo se trabó! 🧙‍♂️ Parece que olvidaste cerrar un paréntesis ')' o una comilla \"";
            } else if (errorMsg.includes('NameError')) {
                friendlyMsg = "¡Esa palabra no existe en el libro de magia! 📖 ¿Escribiste bien el nombre de la variable?";
            } else if (errorMsg.includes('IndentationError')) {
                friendlyMsg = "¡Cuidado con los espacios! 📏 Python es muy ordenado, asegúrate de que el código esté bien alineado.";
            } else if (errorMsg.includes('TypeError')) {
                friendlyMsg = "¡Esos ingredientes no se mezclan! 🧪 No puedes sumar letras con números directamente.";
            }

            // Limpiar mensaje técnico si persiste
            const cleanMsg = friendlyMsg.replace('PythonError: Traceback (most recent call last):', 'Error de Ejecución:');
            // setOutput((prev) => [...prev, `❌ ${cleanMsg}`]);
            addToOutput(`❌ ${cleanMsg}`);
            throw error;

        } finally {
            // 3. DESBLOQUEO (ESTO SOLUCIONA EL BUG)
            setIsRunning(false);
        }
    };

    return { isLoading, isRunning, output, runPython };
};
