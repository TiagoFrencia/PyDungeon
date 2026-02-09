
interface OutputConsoleProps {
    logs: string[];
}

export const OutputConsole = ({ logs }: OutputConsoleProps) => {
    return (
        <div className="bg-dungeon-dark rounded-xl overflow-hidden border-2 border-dungeon-panel shadow-inner h-full flex flex-col font-mono">
            <div className="bg-dungeon-panel px-4 py-2 flex items-center justify-between">
                <span className="text-gray-400 text-xs uppercase tracking-widest">Terminal Output</span>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                </div>
            </div>
            <div className="p-4 overflow-auto flex-1 space-y-2 custom-scrollbar">
                {logs.length === 0 && (
                    <div className="h-full flex items-center justify-center text-amber-500/40 italic">
                        Esperando resultados mágicos...
                    </div>
                )}
                {logs.map((log, index) => (
                    <div key={index} className="text-emerald-400 text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-1 duration-300 font-mono">
                        <span className="text-emerald-600 mr-2">➜</span>
                        {log}
                    </div>
                ))}
            </div>
        </div>
    );
};
