import Editor from '@monaco-editor/react';
import { Play } from 'lucide-react';
import useSound from 'use-sound';
import { useGameStore } from '../store/useGameStore';
import { useState, useEffect } from 'react';

interface CodeEditorProps {
    onRun: (code: string) => void;
    isRunning: boolean;
    initialCode?: string;
}

const editorOptions: any = {
    minimap: { enabled: false },
    fontSize: 16,
    fontFamily: "'Fira Code', monospace",
    padding: { top: 16, bottom: 16 },
    scrollBeyondLastLine: false,
    roundedSelection: true,
    cursorStyle: "line",
    lineNumbers: "on",
};

export const CodeEditor = ({ onRun, isRunning, initialCode }: CodeEditorProps) => {
    const [code, setCode] = useState("# Escribe tu código aquí\nprint('Hola PyDungeon')");

    // Audio
    const { isMuted } = useGameStore();
    const [playCastSfx] = useSound('/sounds/magic_cast.mp3', { volume: 0.6 });

    useEffect(() => {
        if (initialCode) {
            setCode(initialCode);
        }
    }, [initialCode]);

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="relative flex-1 rounded-xl overflow-hidden border-2 border-amber-500/30 shadow-2xl bg-[#1e1e1e]">
                {/* Decorative Header */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-dungeon-panel flex items-center px-4 gap-2 z-10">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-xs text-gray-400 font-mono">spell_book.py</span>
                </div>

                <div className="pt-8 h-full">
                    <Editor
                        height="100%"
                        defaultLanguage="python"
                        theme="vs-dark"
                        value={code}
                        onChange={(val) => setCode(val || "")}
                        options={editorOptions}
                    />
                </div>
            </div>

            <button
                onClick={() => {
                    if (!isMuted) playCastSfx();
                    onRun(code);
                }}
                disabled={isRunning}
                className={`
            group relative w-full flex items-center justify-center gap-3 py-4 px-8 
            rounded-xl font-medieval font-bold text-2xl tracking-wide uppercase 
            transform transition-all duration-200
            ${isRunning
                        ? 'bg-gray-600 cursor-not-allowed opacity-80'
                        : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)] hover:from-amber-400 hover:to-orange-500 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(245,158,11,0.8)] active:translate-y-0.5 active:shadow-none'
                    }
        `}
            >
                {isRunning ? (
                    <span className="animate-pulse">Consultando a los arcanos...</span>
                ) : (
                    <>
                        <Play size={28} className="fill-current" />
                        ¡Lanzar Hechizo!
                    </>
                )}
            </button>
        </div>
    )
}
