import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { PixelBorder } from "@/components/ui/pixel-border";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Accusation {
  id: number;
  content: string;
}

interface AccusationGeneratorProps {
  onAccusationSelected: (accusation: Accusation) => void;
}

export default function AccusationGenerator({ onAccusationSelected }: AccusationGeneratorProps) {
  const { toast } = useToast();
  const [currentAccusation, setCurrentAccusation] = useState<Accusation | null>(null);
  const [isSlotAnimating, setIsSlotAnimating] = useState(false);
  
  const { data: randomAccusation, refetch: getNewAccusation, isLoading } = useQuery({
    queryKey: ['/api/accusations/random'],
    enabled: false,
  });
  
  useEffect(() => {
    // Get an initial accusation when component mounts
    getNewAccusation();
  }, []);
  
  useEffect(() => {
    if (randomAccusation) {
      setCurrentAccusation(randomAccusation);
    }
  }, [randomAccusation]);
  
  const handleGenerateNew = async () => {
    setIsSlotAnimating(true);
    await getNewAccusation();
    
    // Stop animation after some time
    setTimeout(() => {
      setIsSlotAnimating(false);
    }, 1000);
  };
  
  const handleSelectAccusation = () => {
    if (currentAccusation) {
      onAccusationSelected(currentAccusation);
      toast({
        title: "ACCUSATION SELECTED!",
        description: "Now select a character to defend against this accusation!",
        variant: "default",
      });
    } else {
      toast({
        title: "ERROR!",
        description: "Please generate an accusation first!",
        variant: "destructive",
      });
    }
  };
  
  return (
    <section id="accusation-generator" className="py-12 bg-retro-dark">
      <div className="container mx-auto px-4">
        <h2 className="font-pixel text-2xl text-center mb-8 text-retro-pink">THE ACCUSATION GENERATOR</h2>
        
        <PixelBorder className="max-w-4xl mx-auto bg-retro-dark rounded-lg p-6 bg-opacity-80">
          <div className="p-4 bg-black rounded shadow-inner mb-6">
            <div className={`slot-animation h-24 flex items-center justify-center bg-gradient-to-r from-retro-purple to-retro-blue ${isSlotAnimating ? 'glitch-animation' : ''}`}>
              <AnimatePresence mode="wait">
                <motion.p 
                  key={currentAccusation?.id || "loading"}
                  className="font-retro text-2xl text-white text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {isLoading ? (
                    "Loading accusations..."
                  ) : currentAccusation ? (
                    <>
                      The accused stands guilty of <span className="text-retro-yellow font-bold">{currentAccusation.content}</span>.
                    </>
                  ) : (
                    "Click RANDOMIZE to generate an accusation."
                  )}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
          
          <div className="flex justify-center space-x-2 mb-6">
            <motion.button 
              className="bg-retro-orange text-black font-pixel px-6 py-3 rounded shadow-pixel hover:bg-retro-yellow transition-colors duration-300"
              onClick={handleGenerateNew}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              RANDOMIZE
            </motion.button>
            
            <motion.button 
              className={`bg-retro-green text-black font-pixel px-6 py-3 rounded shadow-pixel hover:bg-retro-blue transition-colors duration-300 ${!currentAccusation ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleSelectAccusation}
              whileHover={currentAccusation ? { scale: 1.05 } : {}}
              whileTap={currentAccusation ? { scale: 0.95 } : {}}
              disabled={!currentAccusation || isLoading}
            >
              I'LL DEFEND THIS!
            </motion.button>
          </div>
          
          <div className="text-center">
            <p className="font-mono text-sm text-retro-light opacity-70">
              *Warning: Accusations are satirical and completely fictional. Any resemblance to real events is purely for comedic purposes.
            </p>
          </div>
        </PixelBorder>
      </div>
    </section>
  );
}
