import React from 'react';
import { Scroll } from 'lucide-react';

interface MissionLogProps {
    levelName: string;
    description: string;
}

export const MissionLog: React.FC<MissionLogProps> = ({ levelName, description }) => {
    return (
        <div className="bg-[#2a2a2a] border-2 border-dungeon-gold rounded-lg p-4 mb-4 relative shadow-[0_0_10px_rgba(255,215,0,0.15)] animate-fadeIn">
            {/* Decorative corner accents */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-dungeon-gold"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-dungeon-gold"></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-dungeon-gold"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-dungeon-gold"></div>

            <div className="flex items-start gap-3">
                <div className="mt-1 text-dungeon-gold">
                    <Scroll size={24} />
                </div>
                <div>
                    <h3 className="text-dungeon-gold font-bold text-lg uppercase tracking-wider mb-1">
                        Misión: <span className="text-white">{levelName}</span>
                    </h3>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};
