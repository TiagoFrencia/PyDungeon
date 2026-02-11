import type { Level } from '../services/api';

export const levels: Level[] = [
    {
        id: 1,
        name: "El Bosque Encantado",
        description: "¡Bienvenido! La computadora es muy obediente pero necesita órdenes claras. Copia y pega el código para avanzar 3 pasos.",
        initialCode: `# Tienes que dar 3 pasos
hero.move_right()
# ¿Qué falta aquí? Copia la línea de arriba dos veces más:
`,
        solutionCriteria: "target_cell: 3,0",
        gridLayout: "{\"size\": 10, \"walls\": [[0,1], [1,1], [2,1], [3,1]], \"start\": [0,0], \"end\": [3,0]}",
        type: "GRID"
    },
    {
        id: 2,
        name: "El Troll Matemático",
        description: "El Troll tiene hambre de números GRANDES. ¡Dile cuánto es 5 por 6! (Pista: En programación, multiplicar es con el asterisco *)",
        initialCode: `# El Troll quiere saber cuánto es 5 * 6
numero_1 = 5
numero_2 = 6

# Crea una variable llamada 'resultado'
# resultado = numero_1 * ...

hero.say(resultado)`,
        solutionCriteria: "output: 30",
        gridLayout: "{\"size\": 10, \"walls\": [[5,0], [5,1], [5,2], [5,4], [5,5], [5,3,9]], \"entities\": [{\"type\": \"troll\", \"pos\": [5,3]}], \"start\": [4,3], \"end\": [6,3]}",
        type: "GRID"
    },
    {
        id: 3,
        name: "La Llave Perdida",
        description: "La puerta está cerrada. El orden importa: 1. Camina, 2. Recoge la llave, 3. Abre la puerta.",
        initialCode: `# 1. Camina hacia la llave (está a la derecha)
hero.move_right()
hero.move_right()

# 2. ¡Recógela! (Escribe el comando que falta)
# hero. ...

# 3. Ve a la puerta (abajo)
hero.move_down()`,
        solutionCriteria: "inventory_has: key",
        gridLayout: "{\"size\": 10, \"walls\": [[8,0], [8,1], [8,2], [8,3], [8,4], [8,5], [8,6], [8,7], [8,8], [8,9,8]], \"entities\": [{\"type\": \"key\", \"pos\": [2,0]}], \"start\": [0,0], \"end\": [9,9]}",
        type: "GRID"
    },
    {
        id: 4,
        name: "El Guardián de las Palabras",
        description: "Une las palabras mágicas. ¡Cuidado! Las computadoras no ponen espacios automáticos.",
        initialCode: `palabra_1 = 'Python'
palabra_2 = 'EsGenial' # Trata de cambiar esto si quieres

# ¡Las palabras se pueden sumar!
# Intenta: palabra_1 + " " + palabra_2
mensaje = ... 

hero.say(mensaje)`,
        solutionCriteria: "output: Python EsGenial",
        gridLayout: "{\"size\": 6, \"walls\": [[3,0], [3,1], [3,3], [3,4], [3,5], [3,2,7]], \"entities\": [], \"start\": [2,2], \"end\": [4,2]}",
        type: "GRID"
    },
    {
        id: 5,
        name: "El Puente del Vacío",
        description: "Estás ante un abismo. Usa tu pincel mágico para crear un puente de luz bajo tus pies.",
        initialCode: `# 1. Activa tu pincel mágico (Quita el # del inicio)
# hero.pen_down()

# 2. Camina sobre el vacío
hero.move_right()
hero.move_right()
hero.move_right()
hero.move_right()
hero.move_right()`,
        solutionCriteria: "painted_match: [[1,5], [2,5], [3,5], [4,5], [5,5]]",
        gridLayout: "{\"size\": 10, \"walls\": [], \"start\": [0,5], \"end\": [9,5], \"ghostPattern\": [[1,5], [2,5], [3,5], [4,5], [5,5]]}",
        type: "GRID"
    },
    {
        id: 6,
        name: "El Sello Cuadrado",
        description: "Rompe el sello dibujando un cuadrado perfecto de 4x4. Usa un bucle for.",
        initialCode: `# Queremos dibujar un cuadrado.
# Podrías escribir 4 veces lo mismo...
# hero.move_right()
# hero.turn_right() ...

# ¡Pero mejor usa magia de repetición!
for i in range(4):
    # Escribe aquí los pasos para UN lado del cuadrado
    pass`,
        solutionCriteria: "painted_match: [[2,2], [3,2], [4,2], [5,2], [5,3], [5,4], [5,5], [4,5], [3,5], [2,5], [2,4], [2,3]]",
        gridLayout: "{\"size\": 10, \"walls\": [], \"start\": [2,2], \"end\": [2,2], \"ghostPattern\": [[2,2], [3,2], [4,2], [5,2], [5,3], [5,4], [5,5], [4,5], [3,5], [2,5], [2,4], [2,3]]}",
        type: "GRID"
    },
    {
        id: 7,
        name: "La Cosecha de Maná",
        description: "Hay varios orbes mágicos. Cuéntalos y usa un bucle para recogerlos todos.",
        initialCode: `# Hay varios orbes mágicos.
# Necesitas caminar y recoger, caminar y recoger...

# Completa el hechizo:
for i in range(...):  # ¿Cuántos orbes ves?
    hero.move_right()
    hero.collect()`,
        solutionCriteria: "inventory_has: mana,mana,mana,mana,mana",
        gridLayout: "{\"size\": 10, \"walls\": [], \"entities\": [{\"type\": \"mana\", \"pos\": [0,4]}, {\"type\": \"mana\", \"pos\": [1,4]}, {\"type\": \"mana\", \"pos\": [2,4]}, {\"type\": \"mana\", \"pos\": [3,4]}, {\"type\": \"mana\", \"pos\": [4,4]}], \"start\": [0,4], \"end\": [5,4]}",
        type: "GRID"
    },
    {
        id: 8,
        name: "El Túnel Infinito",
        description: "El túnel es muy largo para contar los pasos. Usa 'while' (mientras) el camino esté libre.",
        initialCode: `# Usa 'while' (mientras) el camino esté libre.
while hero.is_path_clear('right'):
    # ¿Qué debe hacer el héroe mientras pueda avanzar?
    pass`,
        solutionCriteria: "target_cell: 8,4",
        gridLayout: "{\"size\": 10, \"walls\": [[0,3], [1,3], [2,3], [3,3], [4,3], [5,3], [6,3], [7,3], [8,3], [9,3], [0,5], [1,5], [2,5], [3,5], [4,5], [5,5], [6,5], [7,5], [8,5], [9,5], [9,4]], \"start\": [0,4], \"end\": [8,4]}",
        type: "GRID"
    },
    {
        id: 9,
        name: "La Bifurcación",
        description: "El camino se divide. Tienes que decidir.",
        initialCode: `# El camino se divide. Tienes que decidir.

if hero.is_path_clear('right'):
    # Si el camino a la derecha está libre...
    hero.move_right()
else:
    # Si NO está libre (hay pared)...
    # ¿Hacia dónde vamos?
    pass`,
        solutionCriteria: "target_cell: 4,4",
        gridLayout: "{\"size\": 10, \"walls\": [[1,0]], \"start\": [0,0], \"end\": [4,4]}",
        type: "GRID"
    },
    {
        id: 10,
        name: "La Escalera de Repetición",
        description: "Subir un escalón es cansado... ¡Crea un hechizo para hacerlo más fácil! Define 'subir_escalon' y úsalo 6 veces.",
        initialCode: `# Subir un escalón es cansado: Arriba y Derecha.

# 1. Crea tu propio hechizo llamado 'subir_escalon'
def subir_escalon():
    hero.move_up()
    # ¿Qué falta para completar el escalón?
    pass

# 2. Ahora usa tu hechizo 6 veces
for i in range(6):
    subir_escalon()`,
        solutionCriteria: "target_cell: 8,2",
        gridLayout: "{\"size\": 10, \"walls\": [], \"start\": [2,8], \"end\": [8,2]}",
        type: "GRID"
    },
    {
        id: 11,
        name: "El Laberinto",
        description: "¡Escapa del laberinto! Pista: Camina mientras puedas, y gira si chocas.",
        initialCode: `# ¡Escapa del laberinto!
# Pista: Camina mientras puedas, y gira si chocas.

while True:
    if hero.is_path_clear('right'):
        hero.move_right()
    else:
        # ¡Pared! Hay que hacer algo diferente...
        pass`,
        solutionCriteria: "target_cell: 5,5",
        gridLayout: "{\"size\": 10, \"walls\": [[0,1], [1,0], [1,1], [2,1], [3,1], [4,1], [5,1], [5,2], [5,3], [5,4], [4,4], [3,4], [2,4], [1,4], [1,3], [1,2]], \"start\": [0,0], \"end\": [5,5]}",
        type: "GRID"
    },
    {
        id: 12,
        name: "El Panel Arcano",
        description: "¡Necesitamos un botón mágico! Pero cuidado: si usas paréntesis (), el hechizo se lanza solo. Pasa solo el nombre.",
        initialCode: `# Tienes un hechizo llamado 'abrir_puerta'.
def abrir_puerta():
    hero.unlock()

# Necesitamos un botón que lance ese hechizo al hacer clic.
# ¡OJO! Escribe el nombre del hechizo SIN paréntesis '()'

gui.create_button("Click Aquí", ... )`,
        solutionCriteria: "output: Hero unlocks obstacle 🔓",
        gridLayout: "{\"size\": 10, \"walls\": [], \"start\": [0,0], \"end\": [0,0]}",
        type: "GRAPHIC"
    },
    {
        id: 13,
        name: "Telequinesis",
        description: "La meta está a 300 píxeles. Tu hechizo mueve 10 píxeles cada vez. Calcula cuántas veces repetir el hechizo.",
        initialCode: `# La meta está lejos (a 300 píxeles).
# Si la mueves de golpe, se teletransporta (feo).
# Vamos a animarla suavemente.

# Tu hechizo mueve 10 píxeles cada vez.
# ¿Cuántas veces necesitas repetir el hechizo?

veces = ... # Calcula: 300 / 10

for i in range(veces):
    gui.move('burbuja', 10, 0)`,
        solutionCriteria: "graphic_match: {\"id\": \"burbuja\", \"x\": 300, \"y\": 50}",
        gridLayout: "{\"size\": 10, \"walls\": [], \"start\": [0,0], \"end\": [0,0]}",
        type: "GRAPHIC"
    },
    {
        id: 14,
        name: "El Escudo Rebotador",
        description: "Protege tu base. Si la bola va a la derecha, ve a la derecha. Si no... ¡persíguela!",
        initialCode: `def update(ball, paddle):
    # Esta función se ejecuta 60 veces por segundo.

    # Si la bola está más a la derecha que la paleta...
    if ball.x > paddle.x:
        paddle.move(10)

    # ¿Y si la bola se va a la izquierda?
    # Completa el código:
    else:
        pass`,
        solutionCriteria: "simulation_check: bounce, frames: 2000",
        gridLayout: "{\"size\": 10, \"walls\": [], \"start\": [0,0], \"end\": [0,0]}",
        type: "GRAPHIC"
    },
    {
        id: 15,
        name: "Gravedad Artificial",
        description: "Newton está triste porque el Golem flota. Aplica una fuerza constante hacia ABAJO (Y positivo).",
        initialCode: `def apply_gravity(golem):
    # En el mundo real, la gravedad siempre te empuja abajo.
    # En la pantalla, "Abajo" es sumar a Y.

    # Mueve al Golem 5 píxeles hacia abajo en cada cuadro.
    # ¡No te preocupes, el suelo mágico lo atrapará!

    # golem.move( ... , ... )
    pass`,
        solutionCriteria: "simulation_check: gravity",
        gridLayout: "{\"size\": 10, \"walls\": [], \"start\": [0,0], \"end\": [0,0]}",
        type: "GRAPHIC"
    }
];
