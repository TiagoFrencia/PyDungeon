import { levels } from '../data/levels';

export interface Level {
    id: number;
    name: string;
    description: string;
    initialCode: string;
    solutionCriteria: string;
    gridLayout: string; // JSON string
    type?: string;
}

export const getLevels = async (): Promise<Level[]> => {
    // Return static data wrapped in a promise to maintain async interface
    return Promise.resolve(levels);
};

export const jumpToLevel = async (levelId: number): Promise<Level> => {
    const level = levels.find(l => l.id === levelId);
    if (!level) {
        throw new Error('Level not found');
    }
    return Promise.resolve(level);
};
