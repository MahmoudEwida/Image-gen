
import React, { useState, useEffect, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import ControlGroup from './components/ControlPanel';
import { Icon } from './components/icons';
import { generateImageWithNanoBanana } from './services/geminiService';
import { ASPECT_RATIOS, LIGHTING_STYLES, CAMERA_PERSPECTIVES } from './constants';

const App: React.FC = () => {
  const [productImage, setProductImage] = useState<File | null>(null);
  const [styleImage, setStyleImage] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>(ASPECT_RATIOS[0].id);
  const [lightingStyle, setLightingStyle] = useState<string>(LIGHTING_STYLES[0].id);
  const [cameraPerspective, setCameraPerspective] = useState<string>(CAMERA_PERSPECTIVES[0].id);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const styleRefText = styleImage ? "Match the provided style reference image's aesthetic, color palette, and mood. " : "";
    const prompt = `Generate a high-quality, professional product photograph.
- The image should have a ${aspectRatio} aspect ratio.
- The lighting must be ${lightingStyle}.
- The camera perspective should be a ${cameraPerspective}.
- ${styleRefText}The final output must be just the image, with no text or other annotations.`;
    setGeneratedPrompt(prompt.trim());
  }, [aspectRatio, lightingStyle, cameraPerspective, styleImage]);

  const handleGenerate = useCallback(async () => {
    if (!productImage) {
      setError('Please upload a product photo first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setOutputImage(null);

    try {
      const result = await generateImageWithNanoBanana(generatedPrompt, productImage, styleImage);
      setOutputImage(result);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [productImage, styleImage, generatedPrompt]);

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white flex items-center justify-center gap-3">
            <Icon name="sparkles" className="w-10 h-10 text-indigo-400" />
            AI Product Studio
          </h1>
          <p className="mt-2 text-lg text-gray-400">Transform your product photos with Nano Banana</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-4 space-y-8">
            <ImageUploader id="product-image" title="1. Upload Product Photo" image={productImage} onImageChange={setProductImage} />
            <ImageUploader id="style-image" title="2. Add Style Reference (Optional)" image={styleImage} onImageChange={setStyleImage} />
          </div>

          {/* Middle Column: Controls */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex-grow">
              <h2 className="text-2xl font-bold text-white mb-6">3. Customize Style</h2>
              <ControlGroup label="Aspect Ratio" options={ASPECT_RATIOS} selectedValue={aspectRatio} onChange={setAspectRatio} />
              <ControlGroup label="Lighting Style" options={LIGHTING_STYLES} selectedValue={lightingStyle} onChange={setLightingStyle} />
              <ControlGroup label="Camera Perspective" options={CAMERA_PERSPECTIVES} selectedValue={cameraPerspective} onChange={setCameraPerspective} />
              
              <div className="mt-4">
                <label htmlFor="prompt" className="block text-lg font-semibold text-gray-300 mb-3">Generated Prompt</label>
                <textarea
                  id="prompt"
                  readOnly
                  value={generatedPrompt}
                  className="w-full h-32 p-3 bg-gray-900/50 border border-gray-600 rounded-md text-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>
            </div>
            <div className="mt-8">
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !productImage}
                    className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg text-lg flex items-center justify-center gap-3 hover:bg-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    {isLoading ? <Icon name="loading" className="w-6 h-6"/> : <Icon name="sparkles" className="w-6 h-6" />}
                    {isLoading ? 'Generating...' : 'Generate Image'}
                </button>
                {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-4">
             <h2 className="text-2xl font-bold text-white mb-4">4. Generated Image</h2>
             <div className="w-full aspect-square bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden shadow-lg">
                {isLoading && (
                    <div className="text-center text-gray-400">
                        <Icon name="loading" className="w-12 h-12 mx-auto mb-3"/>
                        <p className="font-semibold">AI is creating magic...</p>
                        <p className="text-sm">This may take a moment.</p>
                    </div>
                )}
                {!isLoading && outputImage && (
                    <img src={outputImage} alt="Generated result" className="w-full h-full object-contain" />
                )}
                {!isLoading && !outputImage && (
                    <div className="text-center text-gray-400 p-4">
                        <Icon name="image" className="w-12 h-12 mx-auto mb-3"/>
                        <p className="font-semibold">Your generated image will appear here</p>
                    </div>
                )}
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
