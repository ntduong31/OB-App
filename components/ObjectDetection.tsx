import React, { useRef, useEffect, useState } from 'react';
import type { ObjectDetection as CocoSsdObjectDetection, DetectedObject as CocoSsdDetectedObject } from '@tensorflow-models/coco-ssd';
import type { DetectionOptions } from '../types';

declare global {
  interface Window {
    cocoSsd: {
      load: () => Promise<CocoSsdObjectDetection>;
    };
  }
}

interface ObjectDetectionProps {
  options: DetectionOptions;
}

const drawDetections = (
    ctx: CanvasRenderingContext2D, 
    detections: CocoSsdDetectedObject[],
    options: DetectionOptions
) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";

    detections.forEach(prediction => {
        if (prediction.score < options.confidenceThreshold) return;

        const [x_scaled, y_scaled, width_scaled, height_scaled] = prediction.bbox;

        // Scale bounding box back to original canvas size
        const x = x_scaled / options.inputScale;
        const y = y_scaled / options.inputScale;
        const width = width_scaled / options.inputScale;
        const height = height_scaled / options.inputScale;

        const label = `${prediction.class}: ${Math.round(prediction.score * 100)}%`;

        if (options.showBoxes) {
            ctx.strokeStyle = "#00FFFF";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
        }
        
        if (options.showLabels) {
            ctx.fillStyle = "#00FFFF";
            const textWidth = ctx.measureText(label).width;
            const textHeight = parseInt(font, 10);
            ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

            ctx.fillStyle = "#000000";
            ctx.fillText(label, x + 2, y + 2);
        }
    });
};

export const ObjectDetection: React.FC<ObjectDetectionProps> = ({ options }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement>(null);
  const frameCountRef = useRef<number>(0);
  const [status, setStatus] = useState<string>('Requesting camera access...');
  const [model, setModel] = useState<CocoSsdObjectDetection | null>(null);

  useEffect(() => {
    async function setup() {
      if (typeof window.cocoSsd === 'undefined') {
        setStatus('Error: COCO-SSD model script not loaded.');
        return;
      }
      
      setStatus('Loading COCO-SSD model...');
      try {
        const loadedModel = await window.cocoSsd.load();
        setModel(loadedModel);
        setStatus('Model loaded. Starting camera...');
        await setupCamera();
      } catch (error) {
        console.error("Error loading model:", error);
        setStatus('Error loading model. Check console.');
      }
    }

    async function setupCamera() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          'audio': false,
          'video': { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener('loadeddata', () => {
             setStatus('Camera active. Detecting objects...');
          });
        }
      } else {
          setStatus('Camera access not supported by this browser.');
      }
    }
    setup();
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const detectFrame = async () => {
      frameCountRef.current++;
      if (
        videoRef.current &&
        videoRef.current.readyState === 4 &&
        model &&
        canvasRef.current &&
        offscreenCanvasRef.current &&
        (frameCountRef.current % options.detectionFrequency === 0)
      ) {
        const video = videoRef.current;
        const mainCanvas = canvasRef.current;
        const offscreenCanvas = offscreenCanvasRef.current;
        const offscreenCtx = offscreenCanvas.getContext('2d');

        const scaledWidth = video.videoWidth * options.inputScale;
        const scaledHeight = video.videoHeight * options.inputScale;
        
        if (offscreenCtx) {
            offscreenCanvas.width = scaledWidth;
            offscreenCanvas.height = scaledHeight;
            offscreenCtx.drawImage(video, 0, 0, scaledWidth, scaledHeight);
        }
        
        const predictions = await model.detect(offscreenCanvas, options.maxDetections);
        
        const mainCtx = mainCanvas.getContext('2d');
        if (mainCtx) {
          mainCanvas.width = video.videoWidth;
          mainCanvas.height = video.videoHeight;
          const filteredPredictions = predictions.filter(p => options.selectedClasses.includes(p.class));
          drawDetections(mainCtx, filteredPredictions, options);
        }
      }
      animationFrameId = requestAnimationFrame(detectFrame);
    };

    if (model) {
        detectFrame();
    }
    
    return () => {
        cancelAnimationFrame(animationFrameId);
    };
  }, [model, options]);
  
  return (
    <div className="w-full h-full relative">
       <div className="absolute top-2 left-2 bg-black/50 text-white text-sm px-2 py-1 rounded z-10">
            {status}
        </div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      <canvas ref={offscreenCanvasRef} className="hidden" />
    </div>
  );
};
