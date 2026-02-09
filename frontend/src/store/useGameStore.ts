import { create } from 'zustand';

import type { Level } from '../services/api';
import { getLevels } from '../services/api';

interface Position {
    x: number;
    y: number;
}

interface Entity {
    type: string;
    pos: [number, number];
}

export interface CanvasObject {
    id: string;
    type: 'RECT' | 'CIRCLE' | 'BUTTON';
    x: number;
    y: number;
    width?: number;
    height?: number;
    color?: string;
    text?: string;
    size?: number;
    callback?: string;
}

export interface ReplayFrame {
    [id: string]: Partial<CanvasObject>;
}

interface GameState {
    heroPosition: Position;
    isAnimating: boolean;
    commandQueue: string[];

    // Level Data
    levels: Level[];
    currentLevelIndex: number;
    level: Level | null;
    entities: Entity[];
    walls: number[][]; // Array of [x, y] coordinates
    goal: Position | null;
    isLoadingLevel: boolean;
    fadingWalls: string[]; // "x,y" strings

    collectedItems: string[];
    paintedCells: Record<string, string>; // "x,y": "color"
    ghostPattern: string[]; // "x,y"

    // Magic Canvas
    canvasObjects: CanvasObject[];
    replayFrames: ReplayFrame[]; // For Level 14/15 Simulation
    replayCompletionCallback: (() => void) | null;
    setReplayFrames: (frames: ReplayFrame[], onComplete?: () => void) => void;

    // Audio
    isMuted: boolean;
    toggleMute: () => void;

    // Output Console
    output: string[];
    addToOutput: (line: string) => void;
    clearOutput: () => void;

    // Actions
    addCommand: (command: string) => void;
    shiftCommand: () => string | undefined;
    clearQueue: () => void;
    setHeroPosition: (x: number, y: number) => void;
    setIsAnimating: (isAnimating: boolean) => void;
    fetchLevel: () => Promise<void>;
    loadLevel: (index: number) => void;
    nextLevel: () => void;
    addFadingWall: (x: number, y: number) => void;
    removeWall: (x: number, y: number) => void;
    collectEntity: (x: number, y: number) => void;
    addPaintedCell: (x: number, y: number, color: string) => void;
    addEntity: (entity: Entity) => void;
    clearPaintedCells: () => void;
    addCanvasObject: (obj: CanvasObject) => void;
    updateCanvasObject: (id: string, updates: Partial<CanvasObject>) => void;
    batchUpdateCanvasObjects: (updates: (Partial<CanvasObject> & { id: string })[]) => void;
    clearCanvasObjects: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
    heroPosition: { x: 0, y: 0 },
    isAnimating: false,
    commandQueue: [],

    levels: [],
    currentLevelIndex: 0,
    level: null,
    walls: [],
    entities: [],
    collectedItems: [],
    paintedCells: {},
    ghostPattern: [],
    fadingWalls: [],
    goal: null,
    isLoadingLevel: false,

    // Output Console
    output: [],
    addToOutput: (line) => set((state) => ({ output: [...state.output, line] })),
    clearOutput: () => set({ output: [] }),

    addCommand: (command) =>
        set((state) => ({ commandQueue: [...state.commandQueue, command] })),

    shiftCommand: () => {
        const state = get();
        if (state.commandQueue.length === 0) return undefined;
        const [first, ...rest] = state.commandQueue;
        set({ commandQueue: rest });
        return first;
    },

    clearQueue: () => set({ commandQueue: [] }),

    setHeroPosition: (x, y) => set({ heroPosition: { x, y } }),

    setIsAnimating: (isAnimating) => set({ isAnimating }),

    fetchLevel: async () => {
        set({ isLoadingLevel: true });
        try {
            const levels = await getLevels();
            if (levels.length > 0) {
                // Initialize with the first level
                const initialIndex = 0;
                const level = levels[initialIndex];
                const layout = JSON.parse(level.gridLayout);

                set({
                    levels,
                    currentLevelIndex: initialIndex,
                    level,
                    walls: layout.walls || [],
                    entities: layout.entities || [],
                    collectedItems: [],
                    paintedCells: {},
                    ghostPattern: layout.ghostPattern ? layout.ghostPattern.map((p: number[]) => `${p[0]},${p[1]}`) : [],
                    goal: layout.end ? { x: layout.end[0], y: layout.end[1] } : null,
                    heroPosition: layout.start ? { x: layout.start[0], y: layout.start[1] } : { x: 0, y: 0 },
                    isLoadingLevel: false,
                    commandQueue: [], // clear queue
                    isAnimating: false,
                    canvasObjects: layout.canvasObjects || []
                });
            } else {
                set({ isLoadingLevel: false });
            }
        } catch (error) {
            console.error("Failed to fetch levels:", error);
            set({ isLoadingLevel: false });
        }
    },

    loadLevel: (index: number) => {
        const { levels } = get();
        if (index >= 0 && index < levels.length) {
            const level = levels[index];
            const layout = JSON.parse(level.gridLayout);

            set({
                currentLevelIndex: index,
                level,
                walls: layout.walls || [],
                entities: layout.entities || [],
                collectedItems: [],
                paintedCells: {},
                canvasObjects: layout.canvasObjects || [],
                ghostPattern: layout.ghostPattern ? layout.ghostPattern.map((p: number[]) => `${p[0]},${p[1]}`) : [],
                goal: layout.end ? { x: layout.end[0], y: layout.end[1] } : null,
                heroPosition: layout.start ? { x: layout.start[0], y: layout.start[1] } : { x: 0, y: 0 },
                commandQueue: [],
                isAnimating: false
            });
        }
    },

    nextLevel: () => {
        const { currentLevelIndex, levels, loadLevel } = get();
        if (currentLevelIndex < levels.length - 1) {
            loadLevel(currentLevelIndex + 1);
        }
    },

    addFadingWall: (x, y) => set((state) => ({
        fadingWalls: [...state.fadingWalls, `${x},${y}`]
    })),

    removeWall: (x: number, y: number) => set((state) => ({
        walls: state.walls.filter(w => !(w[0] === x && w[1] === y)),
        fadingWalls: state.fadingWalls.filter(w => w !== `${x},${y}`)
    })),

    collectEntity: (x, y) => set((state) => {
        const entity = state.entities.find(e => e.pos[0] === x && e.pos[1] === y);
        const newCollected = entity ? [...state.collectedItems, entity.type] : state.collectedItems;
        return {
            entities: state.entities.filter(e => !(e.pos[0] === x && e.pos[1] === y)),
            collectedItems: newCollected
        };
    }),

    addPaintedCell: (x, y, color) => set((state) => {
        const key = `${x},${y}`;
        // Verify if it is already painted with the same color to avoid unnecessary updates?
        // But Zustand handles shallow compare.
        return { paintedCells: { ...state.paintedCells, [key]: color } };
    }),

    addEntity: (entity: Entity) => set((state) => ({ entities: [...state.entities, entity] })),

    clearPaintedCells: () => set({ paintedCells: {} }),

    // Magic Canvas Types
    canvasObjects: [],
    replayFrames: [],
    replayCompletionCallback: null as (() => void) | null,
    setReplayFrames: (frames, onComplete) => set({
        replayFrames: frames,
        replayCompletionCallback: onComplete || null
    }),

    addCanvasObject: (obj: CanvasObject) => set((state) => ({
        canvasObjects: [...state.canvasObjects, obj]
    })),

    updateCanvasObject: (id: string, updates: Partial<CanvasObject>) => set((state) => ({
        canvasObjects: state.canvasObjects.map(obj => obj.id === id ? { ...obj, ...updates } : obj)
    })),

    batchUpdateCanvasObjects: (updates) => set((state) => {
        const updatesMap = new Map(updates.map(u => [u.id, u]));
        return {
            canvasObjects: state.canvasObjects.map(obj => {
                const update = updatesMap.get(obj.id);
                return update ? { ...obj, ...update } : obj;
            })
        };
    }),

    clearCanvasObjects: () => set({ canvasObjects: [] }),

    // Audio
    isMuted: false,
    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}));
