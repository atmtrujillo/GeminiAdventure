
import { GoogleGenAI, Type } from "@google/genai";
import type { GameState } from '../types';

if (!process.env.API_KEY) {
  alert("API_KEY environment variable not set. This app requires an API key to function.");
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    sceneDescription: {
      type: Type.STRING,
      description: "A rich, descriptive paragraph detailing the current scene and what is happening. Use vivid language."
    },
    imagePrompt: {
        type: Type.STRING,
        description: "A concise, detailed, and artistic prompt for an AI image generator (max 25 words) that captures the essence of the scene. Example: 'Epic fantasy art of a bioluminescent mushroom forest at night, a lone explorer with a glowing lantern stands in awe, cinematic lighting.'"
    },
    choices: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 3 to 4 distinct actions the player can take next. Each choice should be a short, actionable phrase."
    },
    isGameOver: {
      type: Type.BOOLEAN,
      description: "A boolean indicating if the game has ended (either by victory, death, or conclusion)."
    },
    reason: {
      type: Type.STRING,
      description: "If isGameOver is true, a conclusive paragraph explaining why the game ended. Otherwise, this should be an empty string."
    }
  },
  required: ["sceneDescription", "imagePrompt", "choices", "isGameOver", "reason"]
};

const systemInstruction = `You are a world-class text adventure game engine. Your purpose is to create a dynamic, engaging, and coherent narrative based on a user's theme and choices. For each step, you must provide a detailed 'sceneDescription' that sets the mood, a concise 'imagePrompt' for an AI image generator, a list of 3-4 'choices' for the player, and a boolean 'isGameOver'. If the game is over, provide a 'reason'. The story should be imaginative and adapt to the player's actions. Keep the narrative flowing and create a sense of adventure or mystery. Never break character.`;


export const generateStoryUpdate = async (prompt: string): Promise<GameState> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.8,
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);
        return parsedResponse as GameState;
    } catch (error) {
        console.error("Error generating story update:", error);
        return {
            sceneDescription: "The fabric of reality shimmers and tears. An error has occurred in the ether. Perhaps try a different path or start a new journey?",
            imagePrompt: "cosmic horror, glitch in reality, abstract, error",
            choices: ["Restart the adventure"],
            isGameOver: true,
            reason: "A mysterious force interrupted the story, possibly due to an API error."
        };
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: `Masterpiece, fantasy art, cinematic, high-detail. Prompt: ${prompt}`,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        throw new Error("No images were generated.");
    } catch (error) {
        console.error("Error generating image:", error);
        return "https://picsum.photos/1280/720?grayscale&blur=2";
    }
};
