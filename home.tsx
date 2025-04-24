import { useState } from "react";
import Hero from "@/components/home/Hero";
import AccusationGenerator from "@/components/home/AccusationGenerator";
import CharacterSelection from "@/components/home/CharacterSelection";
import CurrentTrials from "@/components/home/CurrentTrials";
import HallOfPlain from "@/components/home/HallOfPlain";
import { type Character } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import DefenseForm from "@/components/defense/DefenseForm";

interface Accusation {
  id: number;
  content: string;
}

export default function Home() {
  const [selectedAccusation, setSelectedAccusation] = useState<Accusation | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  
  const { data: characters = [], isLoading: isLoadingCharacters } = useQuery({
    queryKey: ['/api/characters'],
  });

  const { data: trials = [], isLoading: isLoadingTrials } = useQuery({
    queryKey: ['/api/trials'],
  });

  const { data: plainCharacters = [], isLoading: isLoadingPlainCharacters } = useQuery({
    queryKey: ['/api/leaderboard/plain'],
    queryFn: async () => {
      const response = await fetch('/api/leaderboard/plain?limit=4');
      if (!response.ok) throw new Error('Failed to fetch hall of plain');
      return response.json();
    }
  });
  
  const handleAccusationSelected = (accusation: Accusation) => {
    setSelectedAccusation(accusation);
    // Scroll to character selection
    const characterSection = document.getElementById('character-selection');
    if (characterSection) {
      characterSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleCharacterSelected = (character: Character) => {
    setSelectedCharacter(character);
    // Scroll to defense form
    const defenseSection = document.getElementById('defense-form');
    if (defenseSection) {
      defenseSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const displayDefenseForm = selectedAccusation && selectedCharacter;
  
  return (
    <div>
      <Hero />
      
      <AccusationGenerator 
        onAccusationSelected={handleAccusationSelected} 
      />
      
      <div id="character-selection">
        <CharacterSelection 
          characters={characters} 
          isLoading={isLoadingCharacters}
          selectedAccusation={selectedAccusation}
          onCharacterSelected={handleCharacterSelected}
        />
      </div>
      
      <CurrentTrials trials={trials} isLoading={isLoadingTrials} />
      
      {displayDefenseForm && (
        <div id="defense-form">
          <DefenseForm 
            accusation={selectedAccusation} 
            character={selectedCharacter}
          />
        </div>
      )}
      
      <HallOfPlain characters={plainCharacters} isLoading={isLoadingPlainCharacters} />
    </div>
  );
}
