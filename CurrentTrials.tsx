import { motion } from "framer-motion";
import { Link } from "wouter";
import TrialCard from "@/components/trials/TrialCard";

interface CurrentTrialsProps {
  trials: any[];
  isLoading: boolean;
}

export default function CurrentTrials({ trials, isLoading }: CurrentTrialsProps) {
  // Display only the first 2 trials on the home page
  const displayedTrials = trials.slice(0, 2);
  
  return (
    <section className="py-12 bg-gradient-to-b from-retro-dark to-black">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-pixel text-2xl text-center mb-8 text-retro-orange"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          CURRENT TRIALS
        </motion.h2>
        
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-retro-yellow font-pixel animate-pulse">LOADING TRIALS...</div>
            </div>
          ) : displayedTrials.length === 0 ? (
            <motion.div 
              className="text-center mb-8 p-8 rounded-lg pixel-border bg-retro-dark"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p className="font-retro text-xl text-retro-light mb-4">
                No ongoing trials at the moment! 
              </p>
              <p className="font-retro text-lg text-retro-yellow">
                Be the first to start a defense case!
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
            >
              {displayedTrials.map(trial => (
                <motion.div 
                  key={trial.id}
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { 
                      y: 0, 
                      opacity: 1,
                      transition: { duration: 0.4 }
                    }
                  }}
                  className="mb-8"
                >
                  <TrialCard trial={trial} />
                </motion.div>
              ))}
            </motion.div>
          )}
          
          <div className="text-center mt-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link href="/trials">
                <div className="inline-block bg-retro-purple text-white font-pixel px-8 py-3 rounded shadow-pixel transform transition hover:scale-105 hover:shadow-pixel-lg cursor-pointer">
                  VIEW ALL TRIALS
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
