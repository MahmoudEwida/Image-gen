
import { GoogleGenAI, Modality, Part, GenerateContentResponse } from "@google/genai";

const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

export const generateImageWithNanoBanana = async (
    prompt: string,
    productImage: File,
    styleImage: File | null
): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const parts: Part[] = [];

    const productPart = await fileToGenerativePart(productImage);
    parts.push(productPart);

    if (styleImage) {
        const stylePart = await fileToGenerativePart(styleImage);
        parts.push({ text: "Use this second image as a style reference for the output image's aesthetic, color palette, and mood:" });
        parts.push(stylePart);
    }
    
    parts.push({ text: prompt });

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: parts },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            }
        }

        for (const part of response.candidates[0].content.parts) {
            if (part.text) {
                throw new Error(`API returned text instead of an image: ${part.text}`);
            }
        }
    }

    throw new Error("No image data found in the API response.");
};
