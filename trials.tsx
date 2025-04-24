import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TrialCard from "@/components/trials/TrialCard";

export default function Trials() {
  const [filter, setFilter] = useState("active"); // active, ending-soon, completed
  
  const { data: trials = [], isLoading } = useQuery({
    queryKey: ['/api/trials'],
  });
  
  const getFilteredTrials = () => {
    if (!trials.length) return [];
    
    switch(filter) {
      case "active":
        return trials.filter(trial => trial.isActive);
      case "ending-soon":
        // Trials ending in less than 24 hours
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return trials.filter(trial => 
          trial.isActive && new Date(trial.endTime) < tomorrow
        );
      case "completed":
        return trials.filter(trial => !trial.isActive);
      default:
        return trials;
    }
  };
  
  const filteredTrials = getFilteredTrials();
  
  return (
    <div className="py-12 bg-gradient-to-b from-retro-dark to-black">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl text-center mb-8 text-retro-orange glitch-animation">CURRENT TRIALS</h1>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button 
            className={`px-4 py-2 rounded shadow-pixel font-pixel text-sm transition-all duration-300 ${
              filter === 'active' 
                ? 'bg-retro-yellow text-retro-dark' 
                : 'bg-retro-dark text-retro-light hover:bg-retro-purple'
            }`}
            onClick={() => setFilter('active')}
          >
            ACTIVE TRIALS
          </button>
          <button 
            className={`px-4 py-2 rounded shadow-pixel font-pixel text-sm transition-all duration-300 ${
              filter === 'ending-soon' 
                ? 'bg-retro-yellow text-retro-dark' 
                : 'bg-retro-dark text-retro-light hover:bg-retro-purple'
            }`}
            onClick={() => setFilter('ending-soon')}
          >
            ENDING SOON
          </button>
          <button 
            className={`px-4 py-2 rounded shadow-pixel font-pixel text-sm transition-all duration-300 ${
              filter === 'completed' 
                ? 'bg-retro-yellow text-retro-dark' 
                : 'bg-retro-dark text-retro-light hover:bg-retro-purple'
            }`}
            onClick={() => setFilter('completed')}
          >
            COMPLETED
          </button>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-retro-yellow font-pixel animate-pulse">LOADING TRIALS...</div>
            </div>
          ) : filteredTrials.length === 0 ? (
            <div className="text-center py-12 pixel-border bg-retro-dark p-8">
              <div className="text-retro-yellow font-pixel mb-4">NO TRIALS FOUND</div>
              <p className="text-retro-light font-retro text-xl">
                The courtroom is empty! Generate an accusation and start a trial.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredTrials.map(trial => (
                <TrialCard key={trial.id} trial={trial} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
