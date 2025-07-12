
export interface GameState {
  sceneDescription: string;
  imagePrompt: string;
  choices: string[];
  isGameOver: boolean;
  reason: string;
}

export interface LoadingState {
  story: boolean;
  image: boolean;
}
