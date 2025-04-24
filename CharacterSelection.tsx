import { motion } from "framer-motion";
import { PixelBorder } from "@/components/ui/pixel-border";
import { Link } from "wouter";
import { type Character } from "@shared/schema";

interface CharacterSelectionProps {
  characters: Character[];
  isLoading: boolean;
  selectedAccusation: { id: number; content: string } | null;
  onCharacterSelected: (character: Character) => void;
}

export default function CharacterSelection({ 
  characters, 
  isLoading, 
  selectedAccusation,
  onCharacterSelected
}: CharacterSelectionProps) {
  
  const handleSelectCharacter = (character: Character) => {
    if (selectedAccusation) {
      onCharacterSelected(character);
    }
  };
  
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
    <section className="py-12 bg-retro-dark bg-opacity-90">
      <div className="container mx-auto px-4">
        <h2 className="font-pixel text-2xl text-center mb-8 text-retro-blue">SELECT YOUR CHARACTER</h2>
        
        {!selectedAccusation && (
          <div className="text-center mb-8">
            <p className="font-retro text-xl text-retro-light">
              {!selectedAccusation ? "Generate and select an accusation first!" : ""}
            </p>
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-retro-yellow font-pixel animate-pulse">LOADING CHARACTERS...</div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {characters.map(character => (
              <motion.div key={character.id} variants={itemVariants}>
                <PixelBorder 
                  className={`bg-retro-purple bg-opacity-30 rounded-lg p-4 transform transition-all duration-300 hover:scale-105 cursor-pointer ${!selectedAccusation ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={() => handleSelectCharacter(character)}
                >
                  <div className="relative mb-4">
                    <img 
                      src={character.avatarUrl}
                      alt={character.name} 
                      className="w-full h-48 object-cover rounded"
                    />
                    <div className="absolute top-0 right-0 m-2">
                      <span className="inline-block bg-retro-yellow text-retro-dark px-2 py-1 rounded font-pixel text-xs">
                        {character.type}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="font-pixel text-lg text-retro-yellow mb-2">{character.name}</h3>
                  <p className="font-retro text-retro-light mb-4">{character.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-retro-pink font-mono text-sm">
                      KARMA: <span className={`${character.karma >= 0 ? 'text-retro-yellow' : 'text-retro-red'}`}>
                        {character.karma >= 0 ? `+${character.karma}` : character.karma}
                      </span>
                    </span>
                    <button className="bg-retro-blue text-white font-pixel px-3 py-1 text-xs rounded shadow-pixel hover:bg-retro-green">
                      SELECT
                    </button>
                  </div>
                </PixelBorder>
              </motion.div>
            ))}
            
            <motion.div variants={itemVariants}>
              <Link href="/profile">
                <div className={`block ${!selectedAccusation ? 'opacity-50 pointer-events-none' : ''}`}>
                  <PixelBorder className="bg-retro-orange bg-opacity-30 rounded-lg p-4 flex items-center justify-center cursor-pointer h-full">
                    <div className="text-center">
                      <i className="fas fa-plus-circle text-5xl text-retro-yellow mb-2 animate-pulse-fast"></i>
                      <p className="font-pixel text-sm text-retro-light">CREATE YOUR OWN CHARACTER</p>
                    </div>
                  </PixelBorder>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
