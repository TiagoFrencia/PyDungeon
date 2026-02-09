import React from 'react';
import { X, Book } from 'lucide-react';
import { commands } from '../data/commands';

interface CommandHelperProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CommandHelper: React.FC<CommandHelperProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border-2 border-amber-600 p-6 rounded-lg shadow-2xl w-full max-w-2xl relative animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-amber-500 transition-colors p-1 hover:bg-white/5 rounded"
                    aria-label="Cerrar ayuda"
                >
                    <X size={24} />
                </button>

                <div className="flex items-center gap-3 mb-6 border-b border-amber-800/50 pb-4 flex-shrink-0">
                    <div className="p-2 bg-amber-900/20 rounded-lg">
                        <Book className="text-amber-500" size={28} />
                    </div>
                    <h2 className="text-3xl font-bold text-amber-500 font-medieval tracking-wide">Grimorio de Comandos</h2>
                </div>

                <div className="space-y-8 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                    {commands.map((group, groupIndex) => (
                        <div key={groupIndex} className="space-y-3">
                            <h3 className="text-lg font-semibold text-dungeon-gold border-b border-gray-700/50 pb-2 mb-3">
                                {group.label}
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                {group.items.map((c, itemIndex) => (
                                    <div key={itemIndex} className="group flex flex-col bg-slate-800/50 hover:bg-slate-800 p-3 rounded-lg border border-amber-900/30 hover:border-amber-500/50 transition-all duration-200">
                                        <code className="text-amber-400 font-mono font-bold text-lg mb-1 select-all">{c.command}</code>
                                        <span className="text-gray-400 text-sm group-hover:text-amber-100/80 transition-colors font-serif">{c.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 text-center text-xs text-gray-500 pt-4 border-t border-gray-800 flex-shrink-0">
                    Usa estos comandos en el editor para controlar a tu héroe.
                </div>
            </div>
        </div>
    );
};
