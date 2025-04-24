import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Hero() {
  return (
    <header className="bg-retro-gradient text-white py-16 border-b-4 border-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url('data:image/svg+xml;utf8,<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="10" height="10" fill="white"/><rect x="10" y="10" width="10" height="10" fill="white"/></svg>')`
      }}></div>
      
      <div className="container mx-auto px-4 z-10 relative">
        <div className="text-center">
          <motion.h1 
            className="font-pixel text-4xl mb-4 text-retro-light drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            ACCUSED!
          </motion.h1>
          
          <motion.p 
            className="font-retro text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            The satirical platform where fictional characters and public figures defend themselves against the most absurd accusations. Because everyone deserves a fair and <span className="italic">completely ridiculous</span> trial.
          </motion.p>
          
          <motion.div 
            className="space-y-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link href="#accusation-generator">
              <div className="inline-block bg-retro-yellow text-retro-dark font-pixel px-8 py-3 rounded shadow-pixel transform transition hover:scale-105 hover:shadow-pixel-lg cursor-pointer">
                GENERATE ACCUSATION
              </div>
            </Link>
            <p className="font-mono text-sm opacity-75">*No characters were harmed in the making of this platform</p>
          </motion.div>
        </div>
      </div>
      
      {/* Animated decorative elements */}
      <div 
        className="absolute -bottom-4 left-0 right-0 h-8 bg-black opacity-20 z-0" 
        style={{ clipPath: "polygon(0% 100%, 5% 0%, 10% 100%, 15% 0%, 20% 100%, 25% 0%, 30% 100%, 35% 0%, 40% 100%, 45% 0%, 50% 100%, 55% 0%, 60% 100%, 65% 0%, 70% 100%, 75% 0%, 80% 100%, 85% 0%, 90% 100%, 95% 0%, 100% 100%)" }}
      ></div>
    </header>
  );
}
