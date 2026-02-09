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
    const response = await fetch('/api/levels');
    if (!response.ok) {
        throw new Error('Failed to fetch levels');
    }
    return response.json();
};

export const jumpToLevel = async (levelId: number): Promise<Level> => {
    const response = await fetch(`/api/game/jump/${levelId}`, {
        method: 'POST',
    });
    if (!response.ok) {
        throw new Error('Failed to jump to level');
    }
    return response.json();
};
