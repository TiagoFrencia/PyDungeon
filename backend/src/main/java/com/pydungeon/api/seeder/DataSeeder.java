package com.pydungeon.api.seeder;

import com.pydungeon.api.domain.Level;
import com.pydungeon.api.repository.LevelRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

        @Bean
        CommandLineRunner initDatabase(LevelRepository repository,
                        org.springframework.jdbc.core.JdbcTemplate jdbcTemplate) {
                return args -> {
                        // Reset the ID sequence to start from 1
                        jdbcTemplate.execute("TRUNCATE TABLE levels RESTART IDENTITY;");

                        seedLevel(repository, "El Bosque Encantado",
                                        "¡Bienvenido! La computadora es muy obediente pero necesita órdenes claras. Copia y pega el código para avanzar 3 pasos.",
                                        "# Tienes que dar 3 pasos\nhero.move_right()\n# ¿Qué falta aquí? Copia la línea de arriba dos veces más:\n",
                                        "target_cell: 3,0",
                                        "{\"size\": 10, \"walls\": [[0,1], [1,1], [2,1], [3,1]], \"start\": [0,0], \"end\": [3,0]}",
                                        "GRID");

                        seedLevel(repository, "El Troll Matemático",
                                        "El Troll tiene hambre de números GRANDES. ¡Dile cuánto es 5 por 6! (Pista: En programación, multiplicar es con el asterisco *)",
                                        "# El Troll quiere saber cuánto es 5 * 6\nnumero_1 = 5\nnumero_2 = 6\n\n# Crea una variable llamada 'resultado'\n# resultado = numero_1 * ...\n\nhero.say(resultado)",
                                        "output: 30",
                                        "{\"size\": 10, \"walls\": [[5,0], [5,1], [5,2], [5,4], [5,5], [5,3,9]], \"entities\": [{\"type\": \"troll\", \"pos\": [5,3]}], \"start\": [4,3], \"end\": [6,3]}",
                                        "GRID");

                        seedLevel(repository, "La Llave Perdida",
                                        "La puerta está cerrada. El orden importa: 1. Camina, 2. Recoge la llave, 3. Abre la puerta.",
                                        "# 1. Camina hacia la llave (está a la derecha)\nhero.move_right()\nhero.move_right()\n\n# 2. ¡Recógela! (Escribe el comando que falta)\n# hero. ...\n\n# 3. Ve a la puerta (abajo)\nhero.move_down()",
                                        "inventory_has: key",
                                        "{\"size\": 10, \"walls\": [[8,0], [8,1], [8,2], [8,3], [8,4], [8,5], [8,6], [8,7], [8,8], [8,9,8]], \"entities\": [{\"type\": \"key\", \"pos\": [2,0]}], \"start\": [0,0], \"end\": [9,9]}",
                                        "GRID");

                        seedLevel(repository, "El Guardián de las Palabras",
                                        "Une las palabras mágicas. ¡Cuidado! Las computadoras no ponen espacios automáticos.",
                                        "palabra_1 = 'Python'\npalabra_2 = 'EsGenial' # Trata de cambiar esto si quieres\n\n# ¡Las palabras se pueden sumar!\n# Intenta: palabra_1 + \" \" + palabra_2\nmensaje = ... \n\nhero.say(mensaje)",
                                        "output: Python EsGenial",
                                        "{\"size\": 6, \"walls\": [[3,0], [3,1], [3,3], [3,4], [3,5], [3,2,7]], \"entities\": [], \"start\": [2,2], \"end\": [4,2]}",
                                        "GRID");

                        seedLevel(repository, "El Puente del Vacío",
                                        "Estás ante un abismo. Usa tu pincel mágico para crear un puente de luz bajo tus pies.",
                                        "# 1. Activa tu pincel mágico (Quita el # del inicio)\n# hero.pen_down()\n\n# 2. Camina sobre el vacío\nhero.move_right()\nhero.move_right()\nhero.move_right()\nhero.move_right()\nhero.move_right()",
                                        "painted_match: [[1,5], [2,5], [3,5], [4,5], [5,5]]",
                                        "{\"size\": 10, \"walls\": [], \"start\": [0,5], \"end\": [9,5], \"ghostPattern\": [[1,5], [2,5], [3,5], [4,5], [5,5]]}",
                                        "GRID");

                        seedLevel(repository, "El Sello Cuadrado",
                                        "Rompe el sello dibujando un cuadrado perfecto de 4x4. Usa un bucle for.",
                                        "# Queremos dibujar un cuadrado.\n# Podrías escribir 4 veces lo mismo...\n# hero.move_right()\n# hero.turn_right() ...\n\n# ¡Pero mejor usa magia de repetición!\nfor i in range(4):\n    # Escribe aquí los pasos para UN lado del cuadrado\n    pass",
                                        "painted_match: [[2,2], [3,2], [4,2], [5,2], [5,3], [5,4], [5,5], [4,5], [3,5], [2,5], [2,4], [2,3]]",
                                        "{\"size\": 10, \"walls\": [], \"start\": [2,2], \"end\": [2,2], \"ghostPattern\": [[2,2], [3,2], [4,2], [5,2], [5,3], [5,4], [5,5], [4,5], [3,5], [2,5], [2,4], [2,3]]}",
                                        "GRID");

                        seedLevel(repository, "La Cosecha de Maná",
                                        "Hay varios orbes mágicos. Cuéntalos y usa un bucle para recogerlos todos.",
                                        "# Hay varios orbes mágicos.\n# Necesitas caminar y recoger, caminar y recoger...\n\n# Completa el hechizo:\nfor i in range(...):  # ¿Cuántos orbes ves?\n    hero.move_right()\n    hero.collect()",
                                        "inventory_has: mana,mana,mana,mana,mana",
                                        "{\"size\": 10, \"walls\": [], \"entities\": [{\"type\": \"mana\", \"pos\": [0,4]}, {\"type\": \"mana\", \"pos\": [1,4]}, {\"type\": \"mana\", \"pos\": [2,4]}, {\"type\": \"mana\", \"pos\": [3,4]}, {\"type\": \"mana\", \"pos\": [4,4]}], \"start\": [0,4], \"end\": [5,4]}",
                                        "GRID");

                        seedLevel(repository, "El Túnel Infinito",
                                        "El túnel es muy largo para contar los pasos. Usa 'while' (mientras) el camino esté libre.",
                                        "# Usa 'while' (mientras) el camino esté libre.\nwhile hero.is_path_clear('right'):\n    # ¿Qué debe hacer el héroe mientras pueda avanzar?\n    pass",
                                        "target_cell: 8,4",
                                        "{\"size\": 10, \"walls\": [[0,3], [1,3], [2,3], [3,3], [4,3], [5,3], [6,3], [7,3], [8,3], [9,3], [0,5], [1,5], [2,5], [3,5], [4,5], [5,5], [6,5], [7,5], [8,5], [9,5], [9,4]], \"start\": [0,4], \"end\": [8,4]}",
                                        "GRID");

                        seedLevel(repository, "La Bifurcación",
                                        "El camino se divide. Tienes que decidir.",
                                        "# El camino se divide. Tienes que decidir.\n\nif hero.is_path_clear('right'):\n    # Si el camino a la derecha está libre...\n    hero.move_right()\nelse:\n    # Si NO está libre (hay pared)...\n    # ¿Hacia dónde vamos?\n    pass",
                                        "target_cell: 4,4",
                                        "{\"size\": 10, \"walls\": [[1,0]], \"start\": [0,0], \"end\": [4,4]}",
                                        "GRID");

                        seedLevel(repository, "La Escalera de Repetición",
                                        "Subir un escalón es cansado... ¡Crea un hechizo para hacerlo más fácil! Define 'subir_escalon' y úsalo 6 veces.",
                                        "# Subir un escalón es cansado: Arriba y Derecha.\n\n# 1. Crea tu propio hechizo llamado 'subir_escalon'\ndef subir_escalon():\n    hero.move_up()\n    # ¿Qué falta para completar el escalón?\n    pass\n\n# 2. Ahora usa tu hechizo 6 veces\nfor i in range(6):\n    subir_escalon()",
                                        "target_cell: 8,2",
                                        "{\"size\": 10, \"walls\": [], \"start\": [2,8], \"end\": [8,2]}",
                                        "GRID");

                        seedLevel(repository, "El Laberinto",
                                        "¡Escapa del laberinto! Pista: Camina mientras puedas, y gira si chocas.",
                                        "# ¡Escapa del laberinto!\n# Pista: Camina mientras puedas, y gira si chocas.\n\nwhile True:\n    if hero.is_path_clear('right'):\n        hero.move_right()\n    else:\n        # ¡Pared! Hay que hacer algo diferente...\n        pass",
                                        "target_cell: 5,5",
                                        "{\"size\": 10, \"walls\": [[0,1], [1,0], [1,1], [2,1], [3,1], [4,1], [5,1], [5,2], [5,3], [5,4], [4,4], [3,4], [2,4], [1,4], [1,3], [1,2]], \"start\": [0,0], \"end\": [5,5]}",
                                        "GRID");

                        seedLevel(repository, "El Panel Arcano",
                                        "¡Necesitamos un botón mágico! Pero cuidado: si usas paréntesis (), el hechizo se lanza solo. Pasa solo el nombre.",
                                        "# Tienes un hechizo llamado 'abrir_puerta'.\ndef abrir_puerta():\n    hero.unlock()\n\n# Necesitamos un botón que lance ese hechizo al hacer clic.\n# ¡OJO! Escribe el nombre del hechizo SIN paréntesis '()'\n\ngui.create_button(\"Click Aquí\", ... )",
                                        "output: Hero unlocks obstacle 🔓",
                                        "{\"size\": 10, \"walls\": [], \"start\": [0,0], \"end\": [0,0]}",
                                        "GRAPHIC");

                        seedLevel(repository, "Telequinesis",
                                        "La meta está a 300 píxeles. Tu hechizo mueve 10 píxeles cada vez. Calcula cuántas veces repetir el hechizo.",
                                        "# La meta está lejos (a 300 píxeles).\n# Si la mueves de golpe, se teletransporta (feo).\n# Vamos a animarla suavemente.\n\n# Tu hechizo mueve 10 píxeles cada vez.\n# ¿Cuántas veces necesitas repetir el hechizo?\n\nveces = ... # Calcula: 300 / 10\n\nfor i in range(veces):\n    gui.move('burbuja', 10, 0)",
                                        "graphic_match: {\"id\": \"burbuja\", \"x\": 300, \"y\": 50}",
                                        "{\"size\": 10, \"walls\": [], \"start\": [0,0], \"end\": [0,0]}",
                                        "GRAPHIC");

                        seedLevel(repository, "El Escudo Rebotador",
                                        "Protege tu base. Si la bola va a la derecha, ve a la derecha. Si no... ¡persíguela!",
                                        "def update(ball, paddle):\n    # Esta función se ejecuta 60 veces por segundo.\n\n    # Si la bola está más a la derecha que la paleta...\n    if ball.x > paddle.x:\n        paddle.move(10)\n\n    # ¿Y si la bola se va a la izquierda?\n    # Completa el código:\n    else:\n        pass",
                                        "simulation_check: bounce, frames: 2000",
                                        "{\"size\": 10, \"walls\": [], \"start\": [0,0], \"end\": [0,0]}",
                                        "GRAPHIC");

                        seedLevel(repository, "Gravedad Artificial",
                                        "Newton está triste porque el Golem flota. Aplica una fuerza constante hacia ABAJO (Y positivo).",
                                        "def apply_gravity(golem):\n    # En el mundo real, la gravedad siempre te empuja abajo.\n    # En la pantalla, \"Abajo\" es sumar a Y.\n\n    # Mueve al Golem 5 píxeles hacia abajo en cada cuadro.\n    # ¡No te preocupes, el suelo mágico lo atrapará!\n\n    # golem.move( ... , ... )\n    pass",
                                        "simulation_check: gravity",
                                        "{\"size\": 10, \"walls\": [], \"start\": [0,0], \"end\": [0,0]}",
                                        "GRAPHIC");
                };
        }

        private void seedLevel(LevelRepository repository, String name, String description, String initialCode,
                        String solutionCriteria, String gridLayout, String type) {
                Level level;
                if (repository.existsByName(name)) {
                        level = repository.findByName(name);
                        level.setDescription(description);
                        level.setInitialCode(initialCode);
                        level.setSolutionCriteria(solutionCriteria);
                        level.setGridLayout(gridLayout);
                        level.setType(type);
                        System.out.println("♻️ Updated level: " + name);
                } else {
                        level = Level.builder()
                                        .name(name)
                                        .description(description)
                                        .initialCode(initialCode)
                                        .solutionCriteria(solutionCriteria)
                                        .gridLayout(gridLayout)
                                        .type(type)
                                        .build();
                        System.out.println("✅ Seeded level: " + name);
                }
                repository.save(level);
        }
}
