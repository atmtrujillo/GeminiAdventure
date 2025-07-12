
import React from 'react';

interface GameScreenProps {
  imageUrl: string | null;
  sceneDescription: string | null;
  loading: boolean;
}

const SkeletonLoader: React.FC = () => (
  <div className="animate-pulse w-full">
    <div className="aspect-video w-full bg-gray-700 rounded-lg mb-6"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
      <div className="h-4 bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-700 rounded w-4/6"></div>
    </div>
  </div>
);

const GameScreen: React.FC<GameScreenProps> = ({ imageUrl, sceneDescription, loading }) => {
  if (loading) {
    return <SkeletonLoader />;
  }

  if (!imageUrl || !sceneDescription) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full min-h-[40vh] lg:min-h-full">
        <h2 className="text-3xl font-bold text-gray-400 mb-2 font-serif-story">Gemini Adventure</h2>
        <p className="text-lg text-gray-500">Your story awaits. Describe a theme to begin.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="aspect-video w-full bg-gray-900/50 rounded-lg overflow-hidden mb-6 shadow-2xl shadow-black/30">
        <img src={imageUrl} alt={sceneDescription.substring(0, 100)} className="w-full h-full object-cover" />
      </div>
      <p className="font-serif-story text-xl md:text-2xl leading-relaxed text-gray-300 whitespace-pre-wrap">
        {sceneDescription}
      </p>
    </div>
  );
};

export default GameScreen;
