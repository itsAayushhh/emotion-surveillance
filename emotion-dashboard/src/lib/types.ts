export type Emotion = 'Angry' | 'Disgust' | 'Fear' | 'Happy' | 'Sad' | 'Surprise' | 'Neutral'

export interface Prediction {
    emotion: Emotion
    confidence: number
}

export interface EmotionConfidence {
    emotion: Emotion
    confidence: number
}

export interface ClassificationMetrics {
    emotion: Emotion
    precision: number
    recall: number
    f1Score: number
    support: number
}

export interface TrainingMetrics {
    epoch: number
    trainAccuracy: number
    valAccuracy: number
    trainLoss: number
    valLoss: number
}

export interface DatasetStats {
    totalImages: number
    trainImages: number
    testImages: number
    classDistribution: {
        emotion: Emotion
        count: number
    }[]
}

export interface ConfusionMatrixData {
    matrix: number[][]
    labels: Emotion[]
}

export interface PredictionResult {
    prediction: Prediction
    allConfidences: EmotionConfidence[]
    heatmapData?: string // base64 encoded heatmap image
}
