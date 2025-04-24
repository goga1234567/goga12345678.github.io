import { useState } from "react";
import { motion } from "framer-motion";
import { PixelBorder } from "@/components/ui/pixel-border";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface TrialCardProps {
  trial: any;
}

export default function TrialCard({ trial }: TrialCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  
  const { mutate: submitVote, isPending } = useMutation({
    mutationFn: async ({ trialId, isInnocent }: { trialId: number, isInnocent: boolean }) => {
      return apiRequest('POST', '/api/votes', {
        trialId,
        userId: 1, // In a real app, this would be the current user ID
        isInnocent
      });
    },
    onSuccess: () => {
      setVoteSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ['/api/trials'] });
      toast({
        title: "VOTE SUBMITTED",
        description: "Your judgment has been recorded in the annals of satirical justice!",
      });
    },
    onError: (error) => {
      toast({
        title: "VOTE ERROR",
        description: `Failed to submit your vote: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const handleVote = (isInnocent: boolean) => {
    if (!trial.id) return;
    
    submitVote({
      trialId: trial.id,
      isInnocent
    });
  };
  
  // Calculate time remaining for the trial
  const getTimeRemaining = () => {
    if (!trial.endTime) return "??:??:??";
    
    const endTime = new Date(trial.endTime);
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return "ENDED";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate innocent/guilty percentages
  const getPercentages = () => {
    const total = (trial.karmaInnocent || 0) + (trial.karmaGuilty || 0);
    if (total === 0) return { innocent: 50, guilty: 50 };
    
    const innocentPercent = Math.round((trial.karmaInnocent || 0) / total * 100);
    return {
      innocent: innocentPercent,
      guilty: 100 - innocentPercent
    };
  };
  
  const percentages = getPercentages();
  const timeRemaining = getTimeRemaining();
  const character = trial.character || {};
  const accusation = trial.accusation || {};
  
  return (
    <PixelBorder className="overflow-hidden bg-retro-dark bg-opacity-90 rounded-lg">
      <div className={`${
        trial.isActive 
          ? timeRemaining === "ENDED" 
            ? "bg-retro-orange" 
            : "bg-retro-purple" 
          : "bg-retro-dark"
      } p-4 flex justify-between items-center`}>
        <h3 className="font-pixel text-retro-yellow">THE PEOPLE vs. {character.name?.toUpperCase()}</h3>
        <span className={`${
          !trial.isActive
            ? "bg-retro-purple"
            : timeRemaining === "ENDED"
            ? "bg-retro-orange"
            : percentages.innocent > percentages.guilty
            ? "bg-retro-green"
            : "bg-retro-yellow"
        } px-2 py-1 rounded text-retro-dark font-mono text-xs`}>
          {!trial.isActive 
            ? "CLOSED" 
            : timeRemaining === "ENDED" 
            ? "ENDING..." 
            : "LIVE NOW!"}
        </span>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Accusation */}
        <div className="md:col-span-1">
          <div className="mb-4">
            <img 
              src="https://images.unsplash.com/photo-1589994965851-a8f479c573a9"
              alt="Court scene" 
              className="w-full h-32 object-cover rounded shadow-pixel"
            />
          </div>
          <h4 className="font-retro text-retro-pink text-lg mb-2">THE ACCUSATION:</h4>
          <p className="font-retro text-retro-light">{accusation.content}</p>
        </div>
        
        {/* Defense */}
        <div className="md:col-span-1">
          <h4 className="font-retro text-retro-blue text-lg mb-2">THE DEFENSE:</h4>
          <p className="font-retro text-retro-light mb-4">
            {trial.defenseContent?.slice(0, 150)}...
          </p>
          <div className="flex items-center">
            <img 
              src={character.avatarUrl}
              alt={character.name} 
              className="w-10 h-10 rounded-full mr-2"
            />
            <span className="font-mono text-retro-yellow text-sm">@{character.name?.replace(/\s+/g, '')}</span>
          </div>
        </div>
        
        {/* Voting */}
        <div className="md:col-span-1 flex flex-col justify-between">
          <div>
            <h4 className="font-retro text-retro-green text-lg mb-2">KARMA COURT:</h4>
            <div className="flex justify-between mb-2">
              <span className="font-mono text-retro-light">INNOCENT</span>
              <span className="font-mono text-retro-light">GUILTY</span>
            </div>
            <motion.div 
              className="h-4 bg-black rounded-full overflow-hidden mb-4"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="h-full bg-retro-blue rounded-full"
                style={{ width: `${percentages.innocent}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${percentages.innocent}%` }}
                transition={{ duration: 1, delay: 0.4 }}
              ></motion.div>
            </motion.div>
            <div className="flex justify-between">
              <span className="font-pixel text-retro-blue text-lg">{percentages.innocent}%</span>
              <span className="font-pixel text-retro-orange text-lg">{percentages.guilty}%</span>
            </div>
          </div>
          
          <div className="flex space-x-2 mt-4">
            <button 
              className={`flex-1 ${
                isPending || voteSubmitted 
                  ? "bg-gray-500 cursor-not-allowed" 
                  : "bg-retro-blue hover:bg-retro-green"
              } font-pixel text-white py-2 rounded-l shadow-pixel transition-colors`}
              onClick={() => handleVote(true)}
              disabled={isPending || voteSubmitted || !trial.isActive}
            >
              INNOCENT
            </button>
            <button 
              className={`flex-1 ${
                isPending || voteSubmitted 
                  ? "bg-gray-500 cursor-not-allowed" 
                  : "bg-retro-orange hover:bg-red-500"
              } font-pixel text-white py-2 rounded-r shadow-pixel transition-colors`}
              onClick={() => handleVote(false)}
              disabled={isPending || voteSubmitted || !trial.isActive}
            >
              GUILTY
            </button>
          </div>
        </div>
      </div>
      
      <div className="px-6 pb-6">
        <p className="font-mono text-xs text-retro-light opacity-70">
          Trial {!trial.isActive ? "ended" : "ends in"}: <span className="text-retro-yellow">{
            !trial.isActive ? "CLOSED" : timeRemaining
          }</span>
        </p>
      </div>
    </PixelBorder>
  );
}
