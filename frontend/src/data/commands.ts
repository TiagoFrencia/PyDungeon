export interface CommandItem {
    command: string;
    desc: string;
}

export interface CommandGroup {
    label: string;
    items: CommandItem[];
}

export const commands: CommandGroup[] = [
    // --- GRUPO 1: MOVIMIENTO BÁSICO ---
    {
        label: "Movimiento",
        items: [
            { command: "hero.move_right()", desc: "➡️ Da un paso a la derecha." },
            { command: "hero.move_left()", desc: "⬅️ Da un paso a la izquierda." },
            { command: "hero.move_up()", desc: "⬆️ Da un paso hacia arriba." },
            { command: "hero.move_down()", desc: "⬇️ Da un paso hacia abajo." }
        ]
    },
    // --- GRUPO 2: ACCIONES ---
    {
        label: "Acciones",
        items: [
            { command: "hero.collect()", desc: "💎 Recoge gemas, llaves u orbes bajo tus pies." },
            { command: "hero.say('Hola')", desc: "🗣️ El héroe habla. ¡Usa comillas para el texto!" },
            { command: "hero.unlock()", desc: "🔓 Abre puertas cercanas (si tienes la llave)." }
        ]
    },
    // --- GRUPO 3: SENTIDOS (SENSORES) ---
    {
        label: "Sentidos",
        items: [
            { command: "hero.is_path_clear('right')", desc: "👀 ¿Está libre el camino? (True/False)." },
            { command: "hero.is_item_here()", desc: "🔍 ¿Hay algo en el suelo donde estoy parado?" }
        ]
    },
    // --- GRUPO 4: CONTROL DE FLUJO (LO DIFÍCIL) ---
    {
        label: "Bucles y Decisiones (¡Cuidado con la Sangría!)",
        items: [
            {
                command: "for i in range(5):",
                desc: "🔄 Repite 5 veces lo que escribas debajo (¡con espacio!)."
            },
            {
                command: "while hero.is_path_clear('right'):",
                desc: "∞ Repite MIENTRAS la condición sea verdadera."
            },
            {
                command: "if hero.is_path_clear('right'):",
                desc: "🤔 SI es verdad, ejecuta el código de abajo."
            },
            {
                command: "else:",
                desc: "🤷 SI NO se cumplió el 'if', haz esto en su lugar."
            }
        ]
    },
    // --- GRUPO 5: MAGIA AVANZADA (MODO GRÁFICO) ---
    {
        label: "Magia Visual (Niveles 12-15)",
        items: [
            { command: "gui.create_button('Texto', funcion)", desc: "🔘 Crea un botón en pantalla." },
            { command: "gui.move('id', 10, 0)", desc: "✨ Mueve un objeto (burbuja) X píxeles." },
            { command: "paddle.move(10)", desc: "🏓 Mueve la paleta (Pong)." },
            { command: "golem.move(0, 5)", desc: "🗿 Empuja al Golem (X, Y). Para gravedad usa Y positivo." }
        ]
    },
    // --- GRUPO 6: HERRAMIENTAS CREATIVAS ---
    {
        label: "Herramientas de Dibujo",
        items: [
            { command: "hero.pen_down()", desc: "🖌️ Baja el pincel para pintar al caminar." },
            { command: "hero.set_color('red')", desc: "🎨 Cambia el color del pincel (inglés)." }
        ]
    }
];
