import { usePyodide } from './hooks/usePyodide';
import { CodeEditor } from './components/CodeEditor';
import { OutputConsole } from './components/OutputConsole';
import { GameGrid } from './components/GameGrid';
import { CommandHelper } from './components/CommandHelper';
import { MagicCanvas } from './components/MagicCanvas';
import { VictoryModal } from './components/VictoryModal';
import { MissionLog } from './components/MissionLog';
import { LevelSelector } from './components/LevelSelector';
import { useGameStore } from './store/useGameStore';
import { useEffect, useState, useRef } from 'react';
import { BookOpen, Volume2, VolumeX } from 'lucide-react';
import useSound from 'use-sound';

function App() {
  const { isLoading, isRunning, output, runPython } = usePyodide();
  const {
    commandQueue,
    shiftCommand,
    heroPosition,
    setHeroPosition,
    isAnimating,
    setIsAnimating,
    fetchLevel,
    goal,
    levels,
    level,
    currentLevelIndex,
    nextLevel,
    loadLevel,
    walls,
    addFadingWall,
    removeWall,
    collectEntity,
    collectedItems,
    addPaintedCell,
    addEntity,
    clearPaintedCells,
    addCanvasObject,
    updateCanvasObject,
    clearCanvasObjects,
    clearOutput
  } = useGameStore();

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showVictory, setShowVictory] = useState(false);

  // Audio State
  const { isMuted, toggleMute } = useGameStore();

  // Background Music
  const [playBgm, { stop: stopBgm, pause: pauseBgm }] = useSound('/sounds/dungeon_theme.mp3', {
    volume: 0.3,
    loop: true,
    interrupt: true,
  });

  // EFECTO: Limpieza automática al cambiar de nivel
  useEffect(() => {
    clearOutput();
  }, [level?.id, clearOutput]);

  useEffect(() => {
    if (!isMuted) {
      playBgm();
    } else {
      pauseBgm();
    }

    return () => {
      stopBgm();
    };
  }, [isMuted, playBgm, pauseBgm, stopBgm]);

  // Ref to track pen state across effect re-runs strictly within the animation sequence
  const isPenDownRef = useRef(false);
  const brushColorRef = useRef('#06b6d4'); // Default cyan

  // Reset pen and canvas when animation stops or new run
  useEffect(() => {
    if (isAnimating === false && commandQueue.length === 0) {
      // clearCanvasObjects(); // Do NOT clear here if we want persistent result after run?
      // But re-running code usually clears previous state.
      // usePyodide clears the queue.
      // The store handles loading level.
    }
  }, [isAnimating, commandQueue.length]);

  useEffect(() => {
    fetchLevel();
  }, [fetchLevel]);

  // Game Loop / Animator
  useEffect(() => {
    if (commandQueue.length > 0 && !isAnimating) {
      const processQueue = async () => {
        // console.log("[GAME] Processing command queue", commandQueue);
        setIsAnimating(true);
        const command = shiftCommand();

        if (command) {
          // Wait for animation frame
          await new Promise(r => setTimeout(r, 400)); // Slightly faster

          // Update State based on command
          let { x, y } = heroPosition;

          if (command === 'PEN_DOWN') {
            isPenDownRef.current = true;
            addPaintedCell(x, y, brushColorRef.current); // Paint current
            // console.log("PEN DOWN");
          } else if (command === 'PEN_UP') {
            isPenDownRef.current = false;
            // console.log("PEN UP");
          } else if (command.startsWith('SET_COLOR:')) {
            const color = command.substring(10);
            brushColorRef.current = color;
            // console.log(`SET COLOR: ${color}`);
          } else if (command.startsWith('SAY:')) {
            const message = command.substring(4);
            // console.log(`[GAME] Hero says: ${message}`);
            // Future: Show speech bubble
          } else if (command.startsWith('COLLECT')) {
            // console.log(`[GAME] Hero collected item at ${x},${y}`);
            collectEntity(x, y);
            // Future: Add to inventory/score
          } else if (command === 'UNLOCK') {
            // Find adjacent wall to unlock
            // Check 4 directions: Right, Left, Down, Up
            const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
            const targetWall = walls.find(w =>
              directions.some(([dx, dy]) => w[0] === x + dx && w[1] === y + dy)
            );

            if (targetWall) {
              // console.log(`[GAME] Unlocking wall at ${targetWall[0]}, ${targetWall[1]}`);
              addFadingWall(targetWall[0], targetWall[1]);

              // Wait for animation (1s)
              await new Promise(r => setTimeout(r, 1000));

              removeWall(targetWall[0], targetWall[1]);

              // console.log('[GAME] Obstacle removed. Path is clear!');
            } else {
              // console.log('[GAME] No adjacent wall to unlock');
            }
          } else if (command.startsWith('SUMMON')) {
            // console.log("[GAME] Hero summoned a Golem!");
            const { goal, addEntity } = useGameStore.getState();
            if (goal) {
              // Summon Golem at the goal/switch position
              addEntity({ type: 'golem', pos: [goal.x, goal.y] });
              // Also trigger visual feedback?
              // console.log("[GAME] Hero summoned a Golem!");
              // ...
            }
          } else if (command.startsWith('CREATE_BUTTON:')) {
            // console.log("Processing CREATE_BUTTON command");
            const payload = JSON.parse(command.substring(14));
            // console.log("Payload:", payload);

            // Calculate Y explicitly to debug
            const currentCount = useGameStore.getState().canvasObjects.length;
            const newY = 10 + (currentCount * 50);

            addCanvasObject({
              id: payload.id,
              type: 'BUTTON',
              x: 50, // Move it left a bit to be sure
              y: newY,
              text: payload.text,
              callback: payload.callback
            });
            // console.log(`[GAME] Created button: ${payload.text} at y=${newY}`);
          } else if (command.startsWith('DRAW_RECT:')) {
            const payload = JSON.parse(command.substring(10));
            addCanvasObject({
              id: payload.id,
              type: 'RECT',
              x: payload.x,
              y: payload.y,
              width: payload.width,
              height: payload.height,
              color: payload.color
            });
            // console.log(`[GAME] Drawn rect at ${payload.x},${payload.y}`);
          } else if (command.startsWith('GAME_LOOP_FRAMES:')) {
            // console.log("Processing GAME_LOOP_FRAMES");
            const result = JSON.parse(command.substring(17));
            const frames = result.frames || result; // Handle {frames: [], won: ...} or []

            // Wait for animation to complete before processing next command
            await new Promise<void>((resolve) => {
              useGameStore.getState().setReplayFrames(frames, () => {
                if (result.won) {
                  // console.log("[GAME] Simulation WON!");
                  setShowVictory(true);
                }
                resolve();
              });
            });
          } else if (command.startsWith('MOVE_OBJECT:')) {
            const payload = JSON.parse(command.substring(12));
            const { id, dx, dy } = payload;
            const currentObj = useGameStore.getState().canvasObjects.find(o => o.id === id);
            if (currentObj) {
              updateCanvasObject(id, {
                x: currentObj.x + dx,
                y: currentObj.y + dy
              });
              // console.log(`[GAME] Moved object ${id}`);
            }
          } else {
            let moveCommand = command;
            let shouldPaint = false;

            if (command.includes(':PAINT')) {
              moveCommand = command.split(':')[0];
              shouldPaint = true;
            }

            if (moveCommand === 'MOVE_RIGHT') x = Math.min(9, x + 1);
            if (moveCommand === 'MOVE_LEFT') x = Math.max(0, x - 1);
            if (moveCommand === 'MOVE_DOWN') y = Math.min(9, y + 1);
            if (moveCommand === 'MOVE_UP') y = Math.max(0, y - 1);

            // Check collision with walls (that are not fading/removed)
            const blockedWall = walls.find(w => w[0] === x && w[1] === y);

            if (!blockedWall) {
              setHeroPosition(x, y);

              if (shouldPaint) {
                addPaintedCell(x, y, brushColorRef.current);
              }

              // Check Victory Condition
              if (goal && x === goal.x && y === goal.y) {
                setShowVictory(true);
              }
            } else {
              // Collision detected
              // Check if it's a Door (Type 8) and we have a Key
              const isDoor = blockedWall.length > 2 && blockedWall[2] === 8;

              if (isDoor) {
                const { collectedItems } = useGameStore.getState();
                const hasKey = collectedItems.includes('key');

                if (hasKey) {
                  // console.log(`[GAME] Unlocking door at ${x},${y} with key`);
                  addFadingWall(x, y);

                  setTimeout(() => {
                    removeWall(x, y);
                  }, 500);

                  // console.log('[GAME] ¡Puerta abierta! Intenta moverte otra vez.');
                } else {
                  // console.log('[GAME] ¡Está cerrada! Necesitas la llave dorada.');
                }
              }
            }
          }
        }

        // Handle explicit backend UNLOCK as Victory if no walls to unlock?
        // Or specific WIN command?
        // Current Backend adds "UNLOCK" log if criteria matches.
        // If command is UNLOCK and no wall found, maybe we should treat as Victory for specific levels?
        if (command === 'UNLOCK') {
          const { x, y } = heroPosition;
          const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
          const targetWall = walls.find(w =>
            directions.some(([dx, dy]) => w[0] === x + dx && w[1] === y + dy)
          );
          if (!targetWall) {
            // If UNLOCK sent but no wall, assume Level Complete!
            // Especially for painting levels where there is no wall to break but a condition to meet.
            setShowVictory(true);
          }
        }

        // Allow next frame
        setIsAnimating(false);
      };
      processQueue();
    }
  }, [commandQueue, isAnimating, heroPosition, shiftCommand, setHeroPosition, setIsAnimating, walls, addFadingWall, removeWall, goal, addPaintedCell, collectEntity]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-dungeon-dark flex flex-col items-center justify-center text-white space-y-6">
        <div className="w-16 h-16 border-4 border-dungeon-accent border-t-transparent rounded-full animate-spin"></div>
        <div className="text-2xl font-bold animate-pulse text-dungeon-gold">Cargando Motores Mágicos...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black text-white p-6 md:p-10 font-sans selection:bg-dungeon-accent selection:text-white relative">
      <LevelSelector />
      <CommandHelper isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <VictoryModal
        isOpen={showVictory}
        onNextLevel={() => {
          setShowVictory(false);
          if (levels.length > 0 && currentLevelIndex === levels.length - 1) {
            loadLevel(0);
          } else {
            nextLevel();
          }
        }}
        isLastLevel={levels.length > 0 && currentLevelIndex === levels.length - 1}
      />

      <header className="mb-4 text-center space-y-2">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 filter drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)] tracking-wide">
          PyDungeon
        </h1>
        <div className="flex flex-col items-center gap-1">
          <p className="text-gray-400 text-lg">Tu aventura de código comienza aquí</p>
          <div className="flex items-center gap-4">
            {level && (
              <div className="bg-gray-800/80 border border-dungeon-accent/50 px-6 py-2 rounded-full shadow-[0_0_15px_rgba(255,215,0,0.2)] animate-fadeIn">
                <span className="text-dungeon-accent font-bold text-xl uppercase tracking-wider">
                  Nivel {currentLevelIndex + 1}: <span className="text-white ml-2">{level.name}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto h-[calc(100vh-180px)] min-h-[600px]">
        {/* Left Column: Editor & Console */}
        <section className="flex flex-col gap-4 h-full relative">
          <div className="flex-2 h-[60%] flex flex-col">
            {level && (
              <MissionLog
                levelName={level.name}
                description={level.description}
              />
            )}
            <div className="flex-1 min-h-0">
              <CodeEditor
                onRun={runPython}
                isRunning={isRunning}
                initialCode={level?.initialCode}
              />
            </div>
          </div>
          <div className="flex-1 h-[40%] min-h-[200px]">
            <OutputConsole logs={output} />
          </div>
        </section>

        {/* Right Column: Game Grid or Magic Canvas */}
        <section className="flex flex-col h-full">
          {level?.type === 'GRAPHIC' ? (
            <MagicCanvas onRunPython={runPython} />
          ) : (
            <GameGrid />
          )}
        </section>
      </main>

      {/* FIXED UI ELEMENTS - Placing at the end to ensure top Z-layer */}

      {/* Mute Button - Top Left */}
      <button
        onClick={toggleMute}
        className="fixed top-4 left-4 z-[100] p-3 bg-slate-900/90 hover:bg-slate-800 text-purple-400 border border-purple-500/50 rounded-lg transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-purple-500/50"
        title={isMuted ? "Activar Sonido" : "Silenciar"}
      >
        {isMuted ? <VolumeX size={24} className="text-gray-400" /> : <Volume2 size={24} />}
      </button>

      {/* Help Button - Top Right */}
      <button
        onClick={() => setIsHelpOpen(true)}
        className="fixed top-4 right-4 z-[100] flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-amber-500 border border-amber-500/50 px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-amber-500/50 font-medieval"
        title="Grimorio de Comandos"
      >
        <BookOpen size={24} />
        <span className="hidden md:inline font-bold text-lg">Grimorio</span>
      </button>

    </div>
  )
}

export default App
