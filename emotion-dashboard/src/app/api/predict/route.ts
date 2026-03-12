import { NextRequest, NextResponse } from 'next/server'

const EMOTION_LABELS = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

/**
 * Read image dimensions from raw bytes (JPEG / PNG).
 */
function getImageDimensions(buffer: Buffer): { width: number; height: number } | null {
    // PNG: signature + IHDR chunk
    if (buffer[0] === 0x89 && buffer[1] === 0x50) {
        const width = buffer.readUInt32BE(16)
        const height = buffer.readUInt32BE(20)
        return { width, height }
    }

    // JPEG: scan for SOF0/SOF2 marker
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
        let offset = 2
        while (offset < buffer.length - 9) {
            if (buffer[offset] !== 0xff) break
            const marker = buffer[offset + 1]
            // SOF0 (0xC0) or SOF2 (0xC2) contain dimensions
            if (marker === 0xc0 || marker === 0xc2) {
                const height = buffer.readUInt16BE(offset + 5)
                const width = buffer.readUInt16BE(offset + 7)
                return { width, height }
            }
            // Skip to next marker
            const segLen = buffer.readUInt16BE(offset + 2)
            offset += 2 + segLen
        }
    }

    // WebP: RIFF....WEBPVP8
    if (buffer.length > 30 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
        // VP8 lossy
        if (buffer.toString('ascii', 12, 15) === 'VP8') {
            const width = buffer.readUInt16LE(26) & 0x3fff
            const height = buffer.readUInt16LE(28) & 0x3fff
            return { width, height }
        }
    }

    return null
}

/**
 * POST /api/predict
 *
 * Tries the Python backend (localhost:8000) first.
 * Falls back to mock predictions with proper face-centered bounding box.
 */
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No image file provided' },
                { status: 400 }
            )
        }

        // Try the Python backend first
        try {
            const proxyFormData = new FormData()
            proxyFormData.append('file', file, file.name || 'image.jpg')

            const backendResponse = await fetch('http://localhost:8000/predict', {
                method: 'POST',
                body: proxyFormData,
                signal: AbortSignal.timeout(5000),
            })

            if (backendResponse.ok) {
                const data = await backendResponse.json()
                return NextResponse.json(data)
            }
        } catch {
            // Python backend not available — fall through to mock
        }

        // Read image to detect dimensions for bounding box
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const dims = getImageDimensions(buffer)

        const imgW = dims?.width || 640
        const imgH = dims?.height || 480

        // Face bounding box: centered, roughly 40-50% of image
        const faceW = Math.round(imgW * 0.35)
        const faceH = Math.round(imgH * 0.45)
        const faceX = Math.round((imgW - faceW) / 2)
        const faceY = Math.round((imgH - faceH) / 2 - imgH * 0.05) // slightly above center

        // Mock prediction — randomized but weighted toward "Happy"
        const confidences = EMOTION_LABELS.map((emotion) => {
            let base: number
            if (emotion === 'Happy') base = 0.55 + Math.random() * 0.15
            else if (emotion === 'Neutral') base = 0.08 + Math.random() * 0.08
            else base = Math.random() * 0.08
            return { emotion, confidence: base }
        })

        // Normalize to sum to 1
        const total = confidences.reduce((sum, c) => sum + c.confidence, 0)
        confidences.forEach((c) => (c.confidence = Math.round((c.confidence / total) * 10000) / 10000))
        confidences.sort((a, b) => b.confidence - a.confidence)
        const top = confidences[0]

        return NextResponse.json({
            success: true,
            prediction: { emotion: top.emotion, confidence: top.confidence },
            allConfidences: confidences,
            boundingBox: { x: faceX, y: faceY, width: faceW, height: faceH },
            heatmap: null, // client will generate
            _mock: true,
            _imageDims: { width: imgW, height: imgH },
        })
    } catch (err) {
        console.error('Predict error:', err)
        return NextResponse.json(
            { success: false, error: 'Failed to process image' },
            { status: 500 }
        )
    }
}
