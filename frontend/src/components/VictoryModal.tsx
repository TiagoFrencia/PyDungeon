import { Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';
import useSound from 'use-sound';
import { useGameStore } from '../store/useGameStore';

interface VictoryModalProps {
    isOpen: boolean;
    onNextLevel: () => void;
    isLastLevel: boolean;
}

export const VictoryModal = ({ isOpen, onNextLevel, isLastLevel }: VictoryModalProps) => {
    // Audio
    const { isMuted } = useGameStore();
    const [playVictorySfx] = useSound('/sounds/level_complete.mp3', { volume: 0.5 });

    useEffect(() => {
        if (isOpen && !isMuted) {
            playVictorySfx();
        }
    }, [isOpen, isMuted, playVictorySfx]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" />

            {/* Modal Content */}
            <div className="relative bg-[#1e1e1e] border-2 border-dungeon-success rounded-2xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(74,222,128,0.2)] animate-in zoom-in-95 duration-300">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-dungeon-success/20 blur-2xl rounded-full" />
                        <Trophy size={64} className="text-dungeon-success relative z-10 animate-bounce" />
                    </div>
                </div>

                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-wider">
                    {isLastLevel ? "¡Juego Completado!" : "¡Nivel Completado!"}
                </h2>

                <p className="text-gray-400 mb-8 text-lg">
                    {isLastLevel
                        ? "¡Eres un verdadero Maestro Python! Has conquistado todos los desafíos."
                        : "Tu código ha sido ejecutado con éxito. ¡El héroe ha llegado a la meta!"}
                </p>

                <button
                    onClick={onNextLevel}
                    className="w-full group flex items-center justify-center gap-3 bg-dungeon-success hover:bg-[#5ed68e] text-dungeon-dark font-bold py-4 px-6 rounded-xl transition-all transform hover:-translate-y-1 hover:shadow-lg"
                >
                    {isLastLevel ? (
                        <>
                            <RotateCcw className="w-6 h-6" />
                            Reiniciar Aventura
                        </>
                    ) : (
                        <>
                            Siguiente Nivel
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
