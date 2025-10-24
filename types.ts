// Represents a single detected object from the model
export interface DetectedObject {
  bbox: [number, number, number, number]; // [x, y, width, height]
  class: string;
  score: number;
}

// Represents the user-configurable options for the detection process
export interface DetectionOptions {
  confidenceThreshold: number;
  showBoxes: boolean;
  showLabels: boolean;
  maxDetections: number;
  detectionFrequency: number;
  inputScale: number;
  selectedClasses: string[];
}
