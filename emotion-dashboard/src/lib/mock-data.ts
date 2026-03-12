import type {
    Emotion,
    ClassificationMetrics,
    TrainingMetrics,
    DatasetStats,
    ConfusionMatrixData,
    EmotionConfidence
} from './types'

export const EMOTIONS: Emotion[] = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

export const EMOTION_COLORS: Record<Emotion, string> = {
    'Angry': '#ef4444',
    'Disgust': '#84cc16',
    'Fear': '#8b5cf6',
    'Happy': '#facc15',
    'Sad': '#3b82f6',
    'Surprise': '#f97316',
    'Neutral': '#6b7280'
}

// Mock confusion matrix (7x7 for FER2013 emotions)
export const mockConfusionMatrix: ConfusionMatrixData = {
    labels: EMOTIONS,
    matrix: [
        [245, 12, 18, 5, 15, 8, 22],   // Angry
        [8, 198, 5, 2, 3, 1, 8],       // Disgust
        [15, 3, 267, 8, 12, 18, 15],   // Fear
        [3, 1, 5, 412, 8, 12, 18],     // Happy
        [18, 2, 15, 12, 289, 5, 25],   // Sad
        [5, 1, 12, 15, 3, 325, 8],     // Surprise
        [22, 5, 18, 25, 28, 12, 378]   // Neutral
    ]
}

// Mock classification metrics
export const mockClassificationMetrics: ClassificationMetrics[] = [
    { emotion: 'Angry', precision: 0.78, recall: 0.76, f1Score: 0.77, support: 325 },
    { emotion: 'Disgust', precision: 0.89, recall: 0.88, f1Score: 0.88, support: 225 },
    { emotion: 'Fear', precision: 0.79, recall: 0.79, f1Score: 0.79, support: 338 },
    { emotion: 'Happy', precision: 0.86, recall: 0.90, f1Score: 0.88, support: 459 },
    { emotion: 'Sad', precision: 0.81, recall: 0.78, f1Score: 0.79, support: 366 },
    { emotion: 'Surprise', precision: 0.85, recall: 0.88, f1Score: 0.87, support: 369 },
    { emotion: 'Neutral', precision: 0.80, recall: 0.78, f1Score: 0.79, support: 488 }
]

// Mock training history
export const mockTrainingHistory: TrainingMetrics[] = [
    { epoch: 1, trainAccuracy: 0.42, valAccuracy: 0.38, trainLoss: 1.65, valLoss: 1.72 },
    { epoch: 2, trainAccuracy: 0.51, valAccuracy: 0.48, trainLoss: 1.38, valLoss: 1.45 },
    { epoch: 3, trainAccuracy: 0.58, valAccuracy: 0.54, trainLoss: 1.18, valLoss: 1.28 },
    { epoch: 4, trainAccuracy: 0.63, valAccuracy: 0.59, trainLoss: 1.02, valLoss: 1.15 },
    { epoch: 5, trainAccuracy: 0.67, valAccuracy: 0.63, trainLoss: 0.91, valLoss: 1.05 },
    { epoch: 6, trainAccuracy: 0.71, valAccuracy: 0.66, trainLoss: 0.82, valLoss: 0.98 },
    { epoch: 7, trainAccuracy: 0.74, valAccuracy: 0.69, trainLoss: 0.75, valLoss: 0.92 },
    { epoch: 8, trainAccuracy: 0.77, valAccuracy: 0.71, trainLoss: 0.68, valLoss: 0.87 },
    { epoch: 9, trainAccuracy: 0.79, valAccuracy: 0.73, trainLoss: 0.62, valLoss: 0.83 },
    { epoch: 10, trainAccuracy: 0.81, valAccuracy: 0.75, trainLoss: 0.57, valLoss: 0.79 },
    { epoch: 11, trainAccuracy: 0.83, valAccuracy: 0.76, trainLoss: 0.52, valLoss: 0.76 },
    { epoch: 12, trainAccuracy: 0.85, valAccuracy: 0.78, trainLoss: 0.48, valLoss: 0.73 },
    { epoch: 13, trainAccuracy: 0.86, valAccuracy: 0.79, trainLoss: 0.44, valLoss: 0.71 },
    { epoch: 14, trainAccuracy: 0.88, valAccuracy: 0.80, trainLoss: 0.41, valLoss: 0.69 },
    { epoch: 15, trainAccuracy: 0.89, valAccuracy: 0.81, trainLoss: 0.38, valLoss: 0.67 },
    { epoch: 16, trainAccuracy: 0.90, valAccuracy: 0.82, trainLoss: 0.35, valLoss: 0.65 },
    { epoch: 17, trainAccuracy: 0.91, valAccuracy: 0.82, trainLoss: 0.33, valLoss: 0.64 },
    { epoch: 18, trainAccuracy: 0.92, valAccuracy: 0.83, trainLoss: 0.31, valLoss: 0.63 },
    { epoch: 19, trainAccuracy: 0.93, valAccuracy: 0.83, trainLoss: 0.29, valLoss: 0.62 },
    { epoch: 20, trainAccuracy: 0.94, valAccuracy: 0.84, trainLoss: 0.27, valLoss: 0.61 }
]

// Mock dataset statistics
export const mockDatasetStats: DatasetStats = {
    totalImages: 35887,
    trainImages: 28709,
    testImages: 7178,
    classDistribution: [
        { emotion: 'Angry', count: 4953 },
        { emotion: 'Disgust', count: 547 },
        { emotion: 'Fear', count: 5121 },
        { emotion: 'Happy', count: 8989 },
        { emotion: 'Sad', count: 6077 },
        { emotion: 'Surprise', count: 4002 },
        { emotion: 'Neutral', count: 6198 }
    ]
}

// Mock sample prediction
export const mockPrediction: EmotionConfidence[] = [
    { emotion: 'Happy', confidence: 0.87 },
    { emotion: 'Surprise', confidence: 0.08 },
    { emotion: 'Neutral', confidence: 0.03 },
    { emotion: 'Fear', confidence: 0.01 },
    { emotion: 'Sad', confidence: 0.01 },
    { emotion: 'Angry', confidence: 0.00 },
    { emotion: 'Disgust', confidence: 0.00 }
]

// Calculate overall accuracy from confusion matrix
export function calculateAccuracy(confusionMatrix: number[][]): number {
    let correct = 0
    let total = 0

    for (let i = 0; i < confusionMatrix.length; i++) {
        for (let j = 0; j < confusionMatrix[i].length; j++) {
            if (i === j) {
                correct += confusionMatrix[i][j]
            }
            total += confusionMatrix[i][j]
        }
    }

    return total > 0 ? correct / total : 0
}

export const mockOverallAccuracy = calculateAccuracy(mockConfusionMatrix.matrix)
