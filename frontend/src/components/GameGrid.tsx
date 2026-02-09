import { motion } from 'framer-motion';
import React from 'react';
import { useGameStore } from '../store/useGameStore';
import clsx from 'clsx'; // Using clsx as it was installed

export const GameGrid = React.memo(() => {
    const { heroPosition, walls, entities, goal, fadingWalls, paintedCells, ghostPattern } = useGameStore();

    const gridSize = 10;
    // Create an array for grid cells
    const gridCells = Array.from({ length: gridSize * gridSize });

    return (
        <div className="bg-dungeon-dark rounded-xl overflow-hidden border-2 border-dungeon-panel shadow-inner h-full flex flex-col items-center justify-center p-4">
            <div
                className="grid gap-1 bg-dungeon-panel p-1 rounded-lg"
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                    width: 'min(100%, 600px)',
                    aspectRatio: '1/1'
                }}
            >
                {gridCells.map((_, index) => {
                    const x = index % gridSize;
                    const y = Math.floor(index / gridSize);

                    const wall = walls.find(w => w[0] === x && w[1] === y);
                    const entity = entities.find(e => e.pos[0] === x && e.pos[1] === y);

                    const isHeroHere = heroPosition.x === x && heroPosition.y === y;
                    const isWall = !!wall;
                    const isGoal = goal && goal.x === x && goal.y === y;
                    const isFading = fadingWalls && fadingWalls.includes(`${x},${y}`);

                    const cellKey = `${x},${y}`;
                    const paintedColor = paintedCells[cellKey];
                    const isPainted = !!paintedColor;
                    const isGhost = ghostPattern && ghostPattern.includes(cellKey);

                    // Wall Types
                    const isInteractiveTroll = isWall && wall.length > 2 && wall[2] === 9; // Type 9 = Troll
                    const isDoor = isWall && wall.length > 2 && wall[2] === 8; // Type 8 = Door
                    const isStatue = isWall && wall.length > 2 && wall[2] === 7; // Type 7 = Statue

                    return (
                        <div
                            key={cellKey}
                            className={clsx(
                                "relative rounded-sm border border-gray-800/30 flex items-center justify-center text-4xl transition-colors duration-300",
                                isWall && !isFading ? (isInteractiveTroll || isDoor || isStatue ? "bg-red-900/20" : "bg-gray-700") : "bg-dungeon-dark",
                                isFading && "fade-out-obstacle z-10",
                                // isPainted && "bg-cyan-500/50 shadow-[0_0_10px_#06b6d4]", WE HANDLE THIS IN STYLE PROP
                                isGhost && !isPainted && "bg-gray-800/80 border-dashed border-gray-500"
                            )}
                            style={{
                                backgroundColor: isPainted ? paintedColor : undefined,
                                boxShadow: isPainted ? `0 0 10px ${paintedColor}` : undefined
                            }}
                        >
                            {isGoal && !isHeroHere && (
                                <span>🏆</span>
                            )}

                            {entity && !isHeroHere && (
                                <span className="z-10 drop-shadow-md">
                                    {entity.type === 'key' ? '🗝️' :
                                        entity.type === 'potion' ? '🧪' :
                                            entity.type === 'statue' ? '🗿' :
                                                entity.type === 'golem' ? '🤖' : '📦'}
                                </span>
                            )}

                            {isWall && !isFading && !isInteractiveTroll && !isDoor && !isStatue && (
                                <span className="opacity-50">🧱</span>
                            )}

                            {isWall && !isFading && isInteractiveTroll && (
                                <span className="interactive-obstacle">👹</span>
                            )}

                            {isWall && !isFading && isDoor && (
                                <span className="interactive-obstacle">🚪</span>
                            )}

                            {isWall && !isFading && isStatue && (
                                <span className="interactive-obstacle">🗿</span>
                            )}

                            {isFading && (
                                <span>{isDoor ? '🚪' : isStatue ? '🗿' : '👹'}</span>
                            )}

                            {isHeroHere && (
                                <motion.div
                                    layoutId="hero"
                                    initial={false}
                                    className="absolute inset-0 flex items-center justify-center text-5xl z-20"
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30
                                    }}
                                >
                                    🧙‍♂️
                                </motion.div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
});
