import React, { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';

interface MagicCanvasProps {
    onRunPython: (code: string) => void;
}

export const MagicCanvas: React.FC<MagicCanvasProps> = ({ onRunPython }) => {
    const { canvasObjects, level, addCanvasObject, replayFrames, setReplayFrames, updateCanvasObject, batchUpdateCanvasObjects } = useGameStore();

    // Replay Animation Loop
    useEffect(() => {
        if (replayFrames && replayFrames.length > 0) {
            let frameIndex = 0;
            let animationFrameId: number;

            // Optimization: avoid re-creating closures every frame
            // Using a high-precision timer loop to target 60FPS
            let lastTime = performance.now();
            const fps = 60;
            const interval = 1000 / fps;
            let accumulator = 0;

            const animate = (time: number) => {
                const deltaTime = time - lastTime;
                lastTime = time;
                accumulator += deltaTime;

                // Process frames if enough time has passed
                // We use a while loop to catch up if we lag, but cap it to avoid spiral of death
                let updates = 0;
                const maxUpdates = 3; // Prevent freezing if we fall too far behind

                while (accumulator >= interval && updates < maxUpdates) {
                    if (frameIndex >= replayFrames.length) {
                        // Animation Finished
                        // Animation Finished
                        const callback = useGameStore.getState().replayCompletionCallback;
                        setReplayFrames([], undefined); // Clear frames
                        if (callback) {
                            // console.log("Animation complete, calling callback");
                            callback();
                        }
                        return; // Stop the loop
                    }

                    const frame = replayFrames[frameIndex];
                    const updatesInFrame: any[] = [];

                    // Efficiently update objects
                    Object.keys(frame).forEach(key => {
                        updatesInFrame.push({ id: key, ...frame[key] });
                    });

                    if (updatesInFrame.length > 0) {
                        batchUpdateCanvasObjects(updatesInFrame);
                    }

                    frameIndex++;
                    accumulator -= interval;
                    updates++;
                }

                // If massive lag, reset accumulator to avoid playing catch-up forever
                if (accumulator > 1000) accumulator = 0;

                animationFrameId = requestAnimationFrame(animate);
            };

            animationFrameId = requestAnimationFrame(animate);

            return () => {
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
            };
        }
    }, [replayFrames, setReplayFrames, updateCanvasObject, batchUpdateCanvasObjects]);

    // Level Setup & Cleanup
    useEffect(() => {
        // Helper to check if object exists
        const exists = (id: string) => useGameStore.getState().canvasObjects.some(o => o.id === id);

        if (level?.name === 'Telequinesis' || level?.id === 13) {
            if (!exists('burbuja')) {
                // Add bubble if missing
                addCanvasObject({ id: 'burbuja', type: 'CIRCLE', x: 200, y: 200, size: 50, color: 'rgba(6,182,212,0.5)' });
            }
        }

        if (level?.name === 'El Escudo Rebotador') {
            if (!exists('ball') && !exists('paddle')) {
                // Clean slate or add missing
                // It's safer to add only if missing.
                if (!exists('ball')) addCanvasObject({ id: 'ball', type: 'CIRCLE', x: 150, y: 50, size: 16, color: '#f87171' });
                if (!exists('paddle')) addCanvasObject({ id: 'paddle', type: 'RECT', x: 150, y: 350, width: 70, height: 10, color: '#22d3ee' });
            }
        }

        // Level 15: Stick Man Gravity Setup
        if (level?.name === 'Gravedad Artificial') {
            const exists = (id: string) => useGameStore.getState().canvasObjects.some(o => o.id === id);

            if (!exists('golem')) {
                addCanvasObject({ id: 'golem', type: 'RECT', x: 0, y: 0, width: 30, height: 30, color: '#a3a3a3' });
                addCanvasObject({ id: 'p1', type: 'RECT', x: 50, y: 150, width: 100, height: 10, color: '#854d0e' });
                addCanvasObject({ id: 'p2', type: 'RECT', x: 200, y: 280, width: 100, height: 10, color: '#854d0e' });
                addCanvasObject({ id: 'floor', type: 'RECT', x: 0, y: 400, width: 600, height: 20, color: '#22c55e' });
            }
        }

    }, [level, addCanvasObject]); // removed canvasObjects from dependency to avoid loop

    const handleCallback = (callbackName?: string) => {
        if (callbackName) {
            // console.log(`[MagicCanvas] Button clicked, executing: ${callbackName}()`);
            onRunPython(`${callbackName}()`);
        }
    };

    return (
        <div className="w-full h-full bg-gray-900 relative overflow-hidden border-2 border-amber-500/50 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            {/* Grid Pattern Background for visual aid */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#06b6d4 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />
            <div className="absolute top-2 right-2 text-xs text-gray-500 font-mono pointer-events-none">
                Debug Info: {canvasObjects.length} objects
            </div>

            {canvasObjects.map((obj) => {
                const style: React.CSSProperties = {
                    position: 'absolute',
                    left: `${obj.x ?? 50}px`,
                    top: `${obj.y ?? 50}px`,
                    width: obj.width ? `${obj.width}px` : undefined,
                    height: obj.height ? `${obj.height}px` : undefined,
                    backgroundColor: obj.color,
                    transition: 'none', // <--- CRÍTICO: Sin suavizado CSS para el Game Loop
                    zIndex: obj.type === 'CIRCLE' ? 20 : 10, // Ensure ball is above background
                };

                if (obj.type === 'RECT') {
                    return (
                        <div
                            key={obj.id}
                            style={style}
                            className="border border-white/50 shadow-lg"
                        />
                    );
                } else if (obj.type === 'CIRCLE') {
                    const circleSize = obj.size || obj.width || 50;
                    return (
                        <div
                            key={obj.id}
                            style={{
                                ...style,
                                width: `${circleSize}px`,
                                height: `${circleSize}px`,
                                borderRadius: '50%'
                            }}
                            className="border border-white/50 shadow-lg glow-effect"
                        />
                    );
                } else if (obj.type === 'BUTTON') {
                    return (
                        <button
                            key={obj.id}
                            style={style}
                            onClick={() => handleCallback(obj.callback)}
                            className="px-4 py-2 bg-dungeon-accent text-gray-900 font-bold rounded hover:bg-dungeon-accent/80 active:scale-95 transition-all shadow-md z-10"
                        >
                            {obj.text || 'Button'}
                        </button>
                    );
                }
                return null;
            })}
        </div>
    );
};
