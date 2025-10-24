import React, { useState } from 'react';
import { ObjectDetection } from './components/ObjectDetection';
import { Controls } from './components/Controls';
import { GithubIcon } from './components/icons/GithubIcon';
import type { DetectionOptions } from './types';
import { COCO_CLASSES } from './components/Controls';

const App: React.FC = () => {
  const [options, setOptions] = useState<DetectionOptions>({
    confidenceThreshold: 0.5,
    showBoxes: true,
    showLabels: true,
    maxDetections: 10,
    detectionFrequency: 2, // Default: detect every 2nd frame for performance
    inputScale: 0.75, // Default: 75% resolution for performance
    selectedClasses: COCO_CLASSES, // Default: all classes selected
  });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center z-20">
        <h1 className="text-xl md:text-2xl font-bold text-cyan-400">Real-Time Object Detection</h1>
        <a 
          href="https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="View on GitHub"
        >
          <GithubIcon className="w-6 h-6" />
        </a>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center p-4 relative">
        <div className="w-full max-w-4xl mx-auto aspect-video bg-black rounded-lg shadow-2xl overflow-hidden relative mb-4">
          <ObjectDetection options={options} />
        </div>
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                 <div className="mb-4">
                    <h2 className="text-lg font-semibold text-cyan-300 mb-2">Technical Note</h2>
                    <p className="text-sm text-gray-400">
                        This web app demonstrates on-device object detection using TensorFlow.js and the COCO-SSD model, running entirely in your browser. While the original request mentioned Python and YOLOv8, that setup requires a backend server. This version fulfills the "no API call" and "real-time" requirements by leveraging client-side machine learning for a smooth, private, and responsive experience.
                    </p>
                </div>
                <Controls options={options} setOptions={setOptions} />
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
