import { useState, useEffect } from 'react';
import type { Level } from '../services/api';
import { getLevels, jumpToLevel } from '../services/api';
import { useGameStore } from '../store/useGameStore';
import { Wrench } from 'lucide-react';

export const LevelSelector = () => {
    const [levels, setLevels] = useState<Level[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const { loadLevel, fetchLevel } = useGameStore();

    useEffect(() => {
        getLevels().then(setLevels).catch(console.error);
    }, []);

    const handleJump = async (levelId: number) => {
        try {
            await jumpToLevel(levelId);
            // We need to reload the game state with this new level
            // Since our store primarily loads by index from the list, 
            // we should probably just find this level in our list and load it by index
            // OR we rely on the backend response. 
            // For now, let's find the index in our local list to keep state consistent
            const index = levels.findIndex(l => l.id === levelId);
            if (index !== -1) {
                loadLevel(index);
            } else {
                // If strictly jumping to an ID not in initial list (rare), we might need to handle differently
                // But for now, just reloading the level list might be safer?
                // Actually, let's just trigger a full fetch?
                await fetchLevel();
                // Then set index? This is async tricky.
                // Simpler: Just rely on the jump endpoint to confirm availability, then load by index.
                loadLevel(index);
            }
            setIsOpen(false);
        } catch (error) {
            console.error("Jump failed:", error);
        }
    };

    if (!import.meta.env.DEV) {
        // Optional: Hide if not in dev mode, though user requested it for testing.
        // keeping it visible for now as requested "Dev Mode" title implying functionality.
    }

    return (
        <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start opacity-40 hover:opacity-100 transition-opacity duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-900 border border-yellow-600/50 text-yellow-500 px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
                title="Dev Mode: Level Selector"
            >
                <Wrench size={18} />
                <span className="font-mono text-sm font-bold">DEV MODE</span>
            </button>

            {isOpen && (
                <div className="mt-2 bg-gray-900/95 border border-yellow-600/50 rounded-lg p-3 shadow-2xl backdrop-blur-sm w-64 animate-in slide-in-from-top-2">
                    <h3 className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2 border-b border-gray-700 pb-1">Jump to Level</h3>
                    <div className="space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {levels.map((lvl) => (
                            <button
                                key={lvl.id}
                                onClick={() => handleJump(lvl.id)}
                                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-yellow-900/30 hover:text-yellow-400 rounded transition-colors flex justify-between items-center group"
                            >
                                <span>{lvl.id}. {lvl.name}</span>
                                <span className="opacity-0 group-hover:opacity-100 text-yellow-500">→</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
