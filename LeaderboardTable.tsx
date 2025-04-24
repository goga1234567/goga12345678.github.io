import { motion } from "framer-motion";
import { type Character } from "@shared/schema";

interface LeaderboardTableProps {
  data: Character[];
  isLoading: boolean;
  type: string;
}

export default function LeaderboardTable({ data, isLoading, type }: LeaderboardTableProps) {
  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <div className="font-pixel text-retro-yellow animate-pulse">LOADING LEADERBOARD...</div>
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="font-pixel text-retro-yellow">NO DATA AVAILABLE</div>
        <p className="font-retro text-retro-light mt-4">Looks like everyone's equally mediocre!</p>
      </div>
    );
  }
  
  // For demo purposes, we're using the same data for all leaderboard types
  // In a real app, we would fetch different data based on the type
  
  const getWinRate = (character: Character) => {
    // This is just for display, in a real app this would come from the backend
    const baseWinRate = Math.max(50 + character.karma / 100, 0);
    return Math.min(Math.floor(baseWinRate), 100);
  };
  
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-retro-purple">
          <th className="font-pixel text-retro-yellow p-4 text-left">#</th>
          <th className="font-pixel text-retro-yellow p-4 text-left">CHARACTER</th>
          <th className="font-pixel text-retro-yellow p-4 text-center">KARMA</th>
          <th className="font-pixel text-retro-yellow p-4 text-center">TRIALS</th>
          <th className="font-pixel text-retro-yellow p-4 text-center">WIN RATE</th>
        </tr>
      </thead>
      <tbody>
        {data.map((character, index) => (
          <motion.tr 
            key={character.id} 
            className="border-b border-retro-dark"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <td className="p-4 font-mono text-retro-yellow">{index + 1}</td>
            <td className="p-4">
              <div className="flex items-center">
                <div className="text-sm font-mono w-8 h-8 flex items-center justify-center bg-retro-dark rounded-full mr-2 border border-retro-yellow overflow-hidden">
                  {character.textAvatar || character.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-retro text-retro-light">{character.name}</div>
                  <div className="font-mono text-xs text-retro-blue">@{character.name.replace(/\s+/g, '')}</div>
                </div>
              </div>
            </td>
            <td className="p-4 text-center font-pixel text-retro-green">
              {character.karma >= 0 ? `+${character.karma}` : character.karma}
            </td>
            <td className="p-4 text-center font-mono text-retro-light">
              {/* Fake trials count for display */}
              {Math.floor(Math.abs(character.karma) / 100) + 5}
            </td>
            <td className="p-4 text-center">
              <div className="w-full bg-black rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="bg-retro-green h-full" 
                  style={{ width: `${getWinRate(character)}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${getWinRate(character)}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                ></motion.div>
              </div>
              <span className="font-mono text-xs text-retro-yellow mt-1 inline-block">
                {getWinRate(character)}%
              </span>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  );
}
