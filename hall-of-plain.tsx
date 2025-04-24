import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { PixelBorder } from "@/components/ui/pixel-border";

export default function HallOfPlain() {
  const { data: plainCharacters = [], isLoading } = useQuery({
    queryKey: ['/api/leaderboard/plain'],
    queryFn: async () => {
      const response = await fetch('/api/leaderboard/plain?limit=20');
      if (!response.ok) throw new Error('Failed to fetch hall of plain');
      return response.json();
    }
  });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  return (
    <div className="py-12 bg-retro-dark">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl text-center mb-2 text-retro-green glitch-animation">HALL OF PLAIN</h1>
        <p className="font-retro text-center text-retro-light mb-8 max-w-2xl mx-auto">
          Neither famous nor infamous, just plain. These middle-of-the-road defenders have achieved perfect mediocrity.
        </p>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-retro-yellow font-pixel animate-pulse">LOADING MEDIOCRITY...</div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {plainCharacters.map(character => (
              <motion.div key={character.id} variants={itemVariants}>
                <PixelBorder className={`bg-gradient-to-b from-retro-blue to-retro-purple bg-opacity-30 rounded-lg p-4 transition-all duration-300 hover:rotate-1`}>
                  <div className="text-center">
                    <img 
                      src={character.avatarUrl}
                      alt={character.name} 
                      className="w-20 h-20 object-cover rounded-full mx-auto mb-2 border-2 border-retro-yellow"
                    />
                    <h3 className="font-pixel text-sm text-retro-yellow mb-1">{character.name}</h3>
                    <div className="font-mono text-xs text-retro-light mb-2">
                      Karma: <span className={`${
                        character.karma > 0 
                          ? 'text-retro-green' 
                          : character.karma < 0 
                          ? 'text-retro-orange' 
                          : 'text-retro-blue'
                      }`}>{character.karma}</span>
                    </div>
                    <p className="font-retro text-xs text-retro-light italic">
                      "{character.description.slice(0, 50)}..."
                    </p>
                    <div className="mt-2 text-xs font-mono text-retro-pink">
                      {Math.floor(45 + Math.random() * 10)}% Win Rate
                    </div>
                  </div>
                </PixelBorder>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        <div className="text-center mt-12 font-retro text-retro-light">
          <p className="italic mb-4">
            "In the grand scheme of cosmic justice, their defenses were neither brilliant nor terrible.
            They simply... were. And isn't that the most beautiful mediocrity of all?"
          </p>
          <p className="text-sm font-mono">- The Keeper of the Plain</p>
        </div>
      </div>
    </div>
  );
}
