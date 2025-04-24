import { motion } from "framer-motion";
import { Link } from "wouter";
import { PixelBorder } from "@/components/ui/pixel-border";
import { type Character } from "@shared/schema";

interface HallOfPlainProps {
  characters: Character[];
  isLoading: boolean;
}

export default function HallOfPlain({ characters, isLoading }: HallOfPlainProps) {
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
    <section className="py-12 bg-retro-dark">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-pixel text-2xl text-center mb-2 text-retro-green"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          HALL OF PLAIN
        </motion.h2>
        
        <motion.p 
          className="font-retro text-center text-retro-light mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Neither famous nor infamous, just plain. These middle-of-the-road defenders have achieved perfect mediocrity.
        </motion.p>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-retro-yellow font-pixel animate-pulse">LOADING MEDIOCRITY...</div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {characters.map(character => (
              <motion.div key={character.id} variants={itemVariants}>
                <PixelBorder className={`bg-gradient-to-b from-retro-blue to-retro-purple bg-opacity-30 rounded-lg p-4 transform transition-all duration-300 hover:rotate-1`}>
                  <div className="text-center">
                    <div className="text-3xl font-mono w-20 h-20 flex items-center justify-center bg-retro-dark rounded-full mx-auto mb-2 border-2 border-retro-yellow overflow-hidden">
                      {character.textAvatar || character.name.slice(0, 2).toUpperCase()}
                    </div>
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
        
        <div className="text-center mt-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <Link href="/hall-of-plain">
              <div className="inline-block bg-retro-green text-black font-pixel px-6 py-2 rounded shadow-pixel transform transition hover:scale-105 hover:shadow-pixel-lg cursor-pointer">
                EXPLORE THE HALL OF PLAIN
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
