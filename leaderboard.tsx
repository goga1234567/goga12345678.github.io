import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { PixelBorder } from "@/components/ui/pixel-border";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";

export default function Leaderboard() {
  const [leaderboardType, setLeaderboardType] = useState("top-defenders");
  
  const { data: topDefenders = [], isLoading: isLoadingTop } = useQuery({
    queryKey: ['/api/leaderboard/top'],
    queryFn: async () => {
      const response = await fetch('/api/leaderboard/top?limit=10');
      if (!response.ok) throw new Error('Failed to fetch top defenders');
      return response.json();
    }
  });
  
  const getTitle = () => {
    switch(leaderboardType) {
      case "top-defenders":
        return "TOP DEFENDERS";
      case "most-acquitted":
        return "MOST ACQUITTED";
      case "most-convicted":
        return "MOST CONVICTED";
      case "best-excuses":
        return "BEST EXCUSES";
      default:
        return "LEADERBOARD";
    }
  };
  
  return (
    <div className="py-12 bg-retro-dark">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl text-center mb-8 text-retro-pink glitch-animation">{getTitle()}</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between mb-6 flex-wrap gap-2">
            <button 
              className={`${
                leaderboardType === 'top-defenders' 
                  ? 'bg-retro-yellow text-retro-dark' 
                  : 'bg-retro-dark text-retro-light hover:bg-retro-purple hover:text-white'
              } font-pixel px-4 py-2 rounded shadow-pixel transition-colors`}
              onClick={() => setLeaderboardType('top-defenders')}
            >
              TOP DEFENDERS
            </button>
            <button 
              className={`${
                leaderboardType === 'most-acquitted' 
                  ? 'bg-retro-yellow text-retro-dark' 
                  : 'bg-retro-dark text-retro-light hover:bg-retro-purple hover:text-white'
              } font-pixel px-4 py-2 rounded shadow-pixel transition-colors`}
              onClick={() => setLeaderboardType('most-acquitted')}
            >
              MOST ACQUITTED
            </button>
            <button 
              className={`${
                leaderboardType === 'most-convicted' 
                  ? 'bg-retro-yellow text-retro-dark' 
                  : 'bg-retro-dark text-retro-light hover:bg-retro-purple hover:text-white'
              } font-pixel px-4 py-2 rounded shadow-pixel transition-colors`}
              onClick={() => setLeaderboardType('most-convicted')}
            >
              MOST CONVICTED
            </button>
            <button 
              className={`${
                leaderboardType === 'best-excuses' 
                  ? 'bg-retro-yellow text-retro-dark' 
                  : 'bg-retro-dark text-retro-light hover:bg-retro-purple hover:text-white'
              } font-pixel px-4 py-2 rounded shadow-pixel transition-colors`}
              onClick={() => setLeaderboardType('best-excuses')}
            >
              BEST EXCUSES
            </button>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={leaderboardType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PixelBorder className="bg-black bg-opacity-80 rounded-lg overflow-hidden">
                <LeaderboardTable 
                  data={topDefenders} 
                  isLoading={isLoadingTop}
                  type={leaderboardType}
                />
              </PixelBorder>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
