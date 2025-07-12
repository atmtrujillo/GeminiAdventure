
import React, { useState } from 'react';

interface ControlsProps {
  choices: string[] | null;
  isGameOver: boolean;
  reason: string | null;
  loading: boolean;
  onSelectChoice: (choice: string) => void;
  onNewGame: (theme: string) => void;
}

const SpinnerIcon: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const Controls: React.FC<ControlsProps> = ({ choices, isGameOver, reason, loading, onSelectChoice, onNewGame }) => {
  const [themeInput, setThemeInput] = useState<string>('A cyberpunk detective in a rain-soaked neon city.');

  const handleNewGameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (themeInput.trim() && !loading) {
      onNewGame(themeInput);
    }
  };

  const isRestartScenario = choices?.length === 1 && choices[0].toLowerCase().includes('restart');

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg backdrop-blur-sm h-full flex flex-col">
      <form onSubmit={handleNewGameSubmit} className="mb-8">
        <h3 className="text-xl font-bold mb-3 text-cyan-300">New Adventure</h3>
        <p className="text-gray-400 mb-4 text-sm">Enter a theme to generate a new story.</p>
        <textarea
          value={themeInput}
          onChange={(e) => setThemeInput(e.target.value)}
          placeholder="e.g., A pirate searching for lost treasure on a haunted island"
          className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition duration-200 resize-none text-gray-200"
          rows={3}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !themeInput.trim()}
          className="mt-3 w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition duration-200 flex items-center justify-center"
        >
          {loading && !choices ? <><SpinnerIcon /><span>Generating...</span></> : 'Start New Game'}
        </button>
      </form>

      <div className="flex-grow">
        <h3 className="text-xl font-bold mb-4 text-amber-300">
          {isGameOver ? "Game Over" : "Your Choices"}
        </h3>
        {isGameOver && reason && (
          <div className="bg-red-900/50 border border-red-700 p-4 rounded-md mb-6">
              <p className="font-serif-story text-lg">{reason}</p>
          </div>
        )}

        <div className="space-y-3">
          {choices && !isRestartScenario && !isGameOver && choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => onSelectChoice(choice)}
              disabled={loading}
              className="w-full text-left bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700/50 disabled:cursor-not-allowed disabled:text-gray-500 text-gray-200 font-medium py-3 px-4 rounded-md transition duration-200 flex items-center"
            >
              {loading && <SpinnerIcon />}
              <span>{choice}</span>
            </button>
          ))}
          {choices && (isRestartScenario || isGameOver) && (
             <button
                onClick={(e) => handleNewGameSubmit(e as any)}
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-md transition duration-200 flex items-center justify-center"
              >
               {loading ? <SpinnerIcon /> : (isRestartScenario ? choices[0] : 'Start a New Adventure')}
             </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default Controls;
