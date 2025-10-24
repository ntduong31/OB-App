import React, { useState, useEffect, useRef } from 'react';
import type { DetectionOptions } from '../types';

export const COCO_CLASSES: string[] = [
  'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light',
  'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
  'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee',
  'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard',
  'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
  'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch',
  'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard',
  'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase',
  'scissors', 'teddy bear', 'hair drier', 'toothbrush'
];

interface ControlsProps {
  options: DetectionOptions;
  setOptions: React.Dispatch<React.SetStateAction<DetectionOptions>>;
}

const ClassSelector: React.FC<ControlsProps> = ({ options, setOptions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClassToggle = (className: string) => {
        setOptions(prev => {
            const newSelected = new Set(prev.selectedClasses);
            if (newSelected.has(className)) {
                newSelected.delete(className);
            } else {
                newSelected.add(className);
            }
            return { ...prev, selectedClasses: Array.from(newSelected) };
        });
    };

    const selectAll = () => setOptions(prev => ({...prev, selectedClasses: COCO_CLASSES}));
    const deselectAll = () => setOptions(prev => ({...prev, selectedClasses: []}));

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-gray-700 px-4 py-2 text-sm font-semibold rounded-md text-left flex justify-between items-center"
            >
                <span>Select Classes</span>
                <span className="text-cyan-400">{options.selectedClasses.length}/{COCO_CLASSES.length}</span>
            </button>
            {isOpen && (
                <div className="absolute bottom-full mb-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-30">
                    <div className="flex justify-between p-2 border-b border-gray-700">
                        <button onClick={selectAll} className="text-xs text-cyan-400 hover:text-cyan-300">Select All</button>
                        <button onClick={deselectAll} className="text-xs text-gray-400 hover:text-gray-300">Deselect All</button>
                    </div>
                    <div className="max-h-48 overflow-y-auto p-2 text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                        {COCO_CLASSES.map(cls => (
                            <label key={cls} className="flex items-center space-x-2 cursor-pointer hover:text-white">
                                <input
                                    type="checkbox"
                                    checked={options.selectedClasses.includes(cls)}
                                    onChange={() => handleClassToggle(cls)}
                                    className="accent-cyan-500 bg-gray-600 rounded"
                                />
                                <span className="capitalize">{cls}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


export const Controls: React.FC<ControlsProps> = ({ options, setOptions }) => {
  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOptions(prev => ({ ...prev, [name]: parseFloat(value) }));
  };
  
  const handleToggle = (name: 'showBoxes' | 'showLabels') => {
    setOptions(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const resolutionMap: {[key: string]: {label: string, value: number}} = {
      '0': { label: 'Low', value: 0.5 },
      '1': { label: 'Medium', value: 0.75 },
      '2': { label: 'High', value: 1.0 },
  };

  const currentResolutionKey = Object.keys(resolutionMap).find(key => resolutionMap[key].value === options.inputScale) || '1';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
            Confidence: <span className="font-bold text-cyan-400">{Math.round(options.confidenceThreshold * 100)}%</span>
            </label>
            <input name="confidenceThreshold" type="range" min="0.1" max="0.9" step="0.05" value={options.confidenceThreshold} onChange={handleOptionChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
        </div>
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
            Max Detections: <span className="font-bold text-cyan-400">{options.maxDetections}</span>
            </label>
            <input name="maxDetections" type="range" min="1" max="50" step="1" value={options.maxDetections} onChange={handleOptionChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
        </div>
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
                Detection Frequency: <span className="font-bold text-cyan-400">Every {options.detectionFrequency} frame(s)</span>
            </label>
            <input name="detectionFrequency" type="range" min="1" max="10" step="1" value={options.detectionFrequency} onChange={handleOptionChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
        </div>
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
                Input Resolution: <span className="font-bold text-cyan-400">{resolutionMap[currentResolutionKey].label}</span>
            </label>
            <input name="inputScale" type="range" min="0" max="2" step="1" value={currentResolutionKey} onChange={(e) => setOptions(prev => ({...prev, inputScale: resolutionMap[e.target.value].value}))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
        </div>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-2">
            <ClassSelector options={options} setOptions={setOptions} />
            <div className="flex items-center justify-start md:justify-end space-x-4">
                <button onClick={() => handleToggle('showBoxes')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${options.showBoxes ? 'bg-cyan-500 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}>
                    {options.showBoxes ? 'Hide Boxes' : 'Show Boxes'}
                </button>
                <button onClick={() => handleToggle('showLabels')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${options.showLabels ? 'bg-cyan-500 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}>
                    {options.showLabels ? 'Hide Labels' : 'Show Labels'}
                </button>
            </div>
       </div>
    </div>
  );
};
