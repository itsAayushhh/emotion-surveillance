'use client'

import { useState, useCallback, useRef } from 'react'
import GlassPanel from '@/components/ui/glass-panel'
import { EMOTION_COLORS } from '@/lib/mock-data'
import type { EmotionConfidence, Emotion } from '@/lib/types'
import { Upload, Image as ImageIcon, Loader2, Crop, Check, X } from 'lucide-react'

const API_URL = ''

interface BoundingBox {
    x: number; y: number; width: number; height: number
}
interface CropRect {
    startX: number; startY: number; endX: number; endY: number
}

export default function EmotionDetectionPanel() {
    // Image states
    const [uploadedImage, setUploadedImage] = useState<string | null>(null)
    const [croppedImage, setCroppedImage] = useState<string | null>(null)
    const [isCropping, setIsCropping] = useState(false)
    const [cropRect, setCropRect] = useState<CropRect | null>(null)
    const [isDraggingCrop, setIsDraggingCrop] = useState(false)

    // Prediction states
    const [prediction, setPrediction] = useState<EmotionConfidence[] | null>(null)
    const [topEmotion, setTopEmotion] = useState<{ emotion: Emotion; confidence: number } | null>(null)
    const [heatmapImage, setHeatmapImage] = useState<string | null>(null)
    const [boundingBox, setBoundingBox] = useState<BoundingBox | null>(null)
    const [imgNaturalSize, setImgNaturalSize] = useState<{ w: number; h: number } | null>(null)
    const [showHeatmap, setShowHeatmap] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const imgRef = useRef<HTMLImageElement>(null)
    const cropContainerRef = useRef<HTMLDivElement>(null)

    // Generate a heatmap overlay on the client using canvas — covers FULL image
    const generateClientHeatmap = useCallback((imageDataUrl: string, bbox: BoundingBox): Promise<string> => {
        return new Promise((resolve) => {
            const img = new window.Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => {
                const canvas = document.createElement('canvas')
                canvas.width = img.naturalWidth
                canvas.height = img.naturalHeight
                const ctx = canvas.getContext('2d')!

                // Draw original image
                ctx.drawImage(img, 0, 0)

                // Create heatmap overlay canvas
                const heatCanvas = document.createElement('canvas')
                heatCanvas.width = canvas.width
                heatCanvas.height = canvas.height
                const hctx = heatCanvas.getContext('2d')!

                const cx = bbox.x + bbox.width / 2
                const cy = bbox.y + bbox.height / 2
                // Use diagonal of image so the gradient covers everything
                const fullRadius = Math.sqrt(canvas.width ** 2 + canvas.height ** 2) * 0.6

                // Full-image JET colormap gradient — hot center on face, cool edges
                const gradient = hctx.createRadialGradient(cx, cy, 0, cx, cy, fullRadius)
                gradient.addColorStop(0, 'rgba(255, 0, 0, 0.85)')
                gradient.addColorStop(0.08, 'rgba(255, 60, 0, 0.75)')
                gradient.addColorStop(0.15, 'rgba(255, 160, 0, 0.6)')
                gradient.addColorStop(0.25, 'rgba(255, 255, 0, 0.45)')
                gradient.addColorStop(0.4, 'rgba(0, 255, 100, 0.35)')
                gradient.addColorStop(0.6, 'rgba(0, 150, 255, 0.3)')
                gradient.addColorStop(0.8, 'rgba(0, 50, 200, 0.25)')
                gradient.addColorStop(1, 'rgba(0, 0, 128, 0.2)')
                hctx.fillStyle = gradient
                hctx.fillRect(0, 0, canvas.width, canvas.height)

                // Blend heatmap onto original
                ctx.globalAlpha = 0.45
                ctx.drawImage(heatCanvas, 0, 0)
                ctx.globalAlpha = 1.0

                // Draw bounding box
                ctx.strokeStyle = '#00ff00'
                ctx.lineWidth = Math.max(2, Math.round(canvas.width / 250))
                ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height)

                resolve(canvas.toDataURL('image/jpeg', 0.92))
            }
            img.src = imageDataUrl
        })
    }, [])

    // Send image (data URL) to backend
    const sendToBackend = useCallback(async (imageDataUrl: string) => {
        setIsLoading(true)
        setError(null)
        setPrediction(null)
        setTopEmotion(null)
        setHeatmapImage(null)
        setBoundingBox(null)

        try {
            const blob = await (await fetch(imageDataUrl)).blob()
            const formData = new FormData()
            formData.append('file', blob, 'image.jpg')
            const response = await fetch(`${API_URL}/api/predict`, { method: 'POST', body: formData })
            const data = await response.json()
            if (data.success) {
                setPrediction(data.allConfidences as EmotionConfidence[])
                setTopEmotion(data.prediction as { emotion: Emotion; confidence: number })
                if (data.boundingBox) setBoundingBox(data.boundingBox as BoundingBox)

                if (data.heatmap) {
                    // Use server-provided heatmap (Python backend)
                    setHeatmapImage(data.heatmap)
                } else if (data.boundingBox) {
                    // Generate heatmap client-side
                    const heatmap = await generateClientHeatmap(imageDataUrl, data.boundingBox as BoundingBox)
                    setHeatmapImage(heatmap)
                }
            } else {
                setError(data.error || 'Failed to analyze image')
            }
        } catch {
            setError('Cannot connect to the analysis backend.')
        } finally {
            setIsLoading(false)
        }
    }, [generateClientHeatmap])

    // Open crop modal after file is selected
    const handleFile = useCallback((file: File) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string
            setUploadedImage(dataUrl)
            setCroppedImage(null)
            setPrediction(null)
            setTopEmotion(null)
            setHeatmapImage(null)
            setBoundingBox(null)
            setError(null)
            setCropRect(null)
            setIsCropping(true) // Open the crop modal

            const img = new window.Image()
            img.onload = () => setImgNaturalSize({ w: img.naturalWidth, h: img.naturalHeight })
            img.src = dataUrl
        }
        reader.readAsDataURL(file)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith('image/')) handleFile(file)
    }, [handleFile])

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
    }, [handleFile])

    // Crop drawing
    const getCropPos = (e: React.MouseEvent) => {
        const container = cropContainerRef.current
        if (!container) return null
        const rect = container.getBoundingClientRect()
        return {
            x: Math.max(0, Math.min(e.clientX - rect.left, rect.width)),
            y: Math.max(0, Math.min(e.clientY - rect.top, rect.height)),
        }
    }

    const onCropStart = (e: React.MouseEvent) => {
        const pos = getCropPos(e)
        if (!pos) return
        setIsDraggingCrop(true)
        setCropRect({ startX: pos.x, startY: pos.y, endX: pos.x, endY: pos.y })
    }
    const onCropMove = (e: React.MouseEvent) => {
        if (!isDraggingCrop || !cropRect) return
        const pos = getCropPos(e)
        if (!pos) return
        setCropRect(prev => prev ? { ...prev, endX: pos.x, endY: pos.y } : null)
    }
    const onCropEnd = () => setIsDraggingCrop(false)

    // Apply crop
    const applyCrop = useCallback(async () => {
        if (!uploadedImage || !imgNaturalSize || !cropContainerRef.current) return

        const container = cropContainerRef.current
        const imgEl = container.querySelector('img')
        if (!imgEl) return

        const containerRect = container.getBoundingClientRect()
        const imgAspect = imgNaturalSize.w / imgNaturalSize.h
        const containerAspect = containerRect.width / containerRect.height
        let renderW: number, renderH: number, offsetX: number, offsetY: number

        if (imgAspect > containerAspect) {
            renderW = containerRect.width; renderH = containerRect.width / imgAspect; offsetX = 0; offsetY = (containerRect.height - renderH) / 2
        } else {
            renderH = containerRect.height; renderW = containerRect.height * imgAspect; offsetX = (containerRect.width - renderW) / 2; offsetY = 0
        }

        let sx: number, sy: number, sw: number, sh: number

        if (cropRect) {
            const x1 = Math.min(cropRect.startX, cropRect.endX)
            const y1 = Math.min(cropRect.startY, cropRect.endY)
            const x2 = Math.max(cropRect.startX, cropRect.endX)
            const y2 = Math.max(cropRect.startY, cropRect.endY)

            sx = Math.max(0, ((x1 - offsetX) / renderW) * imgNaturalSize.w)
            sy = Math.max(0, ((y1 - offsetY) / renderH) * imgNaturalSize.h)
            sw = Math.min(imgNaturalSize.w - sx, ((x2 - x1) / renderW) * imgNaturalSize.w)
            sh = Math.min(imgNaturalSize.h - sy, ((y2 - y1) / renderH) * imgNaturalSize.h)

            if (sw < 10 || sh < 10) { sx = 0; sy = 0; sw = imgNaturalSize.w; sh = imgNaturalSize.h }
        } else {
            sx = 0; sy = 0; sw = imgNaturalSize.w; sh = imgNaturalSize.h
        }

        const canvas = document.createElement('canvas')
        canvas.width = sw; canvas.height = sh
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const sourceImg = new window.Image()
        sourceImg.crossOrigin = 'anonymous'
        sourceImg.src = uploadedImage

        await new Promise<void>(resolve => {
            sourceImg.onload = () => { ctx.drawImage(sourceImg, sx, sy, sw, sh, 0, 0, sw, sh); resolve() }
        })

        const croppedUrl = canvas.toDataURL('image/jpeg', 0.9)
        setCroppedImage(croppedUrl)
        setIsCropping(false)
        setCropRect(null)
        setImgNaturalSize({ w: sw, h: sh })
        sendToBackend(croppedUrl)
    }, [uploadedImage, imgNaturalSize, cropRect, sendToBackend])

    // Skip crop — use full image
    const skipCrop = useCallback(() => {
        if (!uploadedImage) return
        setCroppedImage(uploadedImage)
        setIsCropping(false)
        setCropRect(null)
        sendToBackend(uploadedImage)
    }, [uploadedImage, sendToBackend])

    const handleClear = () => {
        setUploadedImage(null); setCroppedImage(null); setPrediction(null); setTopEmotion(null)
        setHeatmapImage(null); setBoundingBox(null); setImgNaturalSize(null)
        setShowHeatmap(false); setIsCropping(false); setCropRect(null); setError(null)
    }

    // Bounding box overlay
    const getOverlayStyle = () => {
        if (!boundingBox || !imgNaturalSize || !imgRef.current) return null
        const rect = imgRef.current.getBoundingClientRect()
        const imgAspect = imgNaturalSize.w / imgNaturalSize.h
        const containerAspect = rect.width / rect.height
        let renderW: number, renderH: number, offsetX: number, offsetY: number
        if (imgAspect > containerAspect) {
            renderW = rect.width; renderH = rect.width / imgAspect; offsetX = 0; offsetY = (rect.height - renderH) / 2
        } else {
            renderH = rect.height; renderW = rect.height * imgAspect; offsetX = (rect.width - renderW) / 2; offsetY = 0
        }
        return {
            left: offsetX + boundingBox.x * (renderW / imgNaturalSize.w),
            top: offsetY + boundingBox.y * (renderH / imgNaturalSize.h),
            width: boundingBox.width * (renderW / imgNaturalSize.w),
            height: boundingBox.height * (renderH / imgNaturalSize.h),
        }
    }

    const getCropStyle = () => {
        if (!cropRect) return null
        return {
            left: Math.min(cropRect.startX, cropRect.endX),
            top: Math.min(cropRect.startY, cropRect.endY),
            width: Math.abs(cropRect.endX - cropRect.startX),
            height: Math.abs(cropRect.endY - cropRect.startY),
        }
    }

    const overlayStyle = topEmotion && !isCropping ? getOverlayStyle() : null
    const emotionColor = topEmotion ? (EMOTION_COLORS[topEmotion.emotion] || '#00f3ff') : '#00f3ff'
    const displayImage = showHeatmap && heatmapImage ? heatmapImage : (croppedImage || uploadedImage)

    return (
        <>
            {/* ========== CROP MODAL (FULLSCREEN OVERLAY) ========== */}
            {isCropping && uploadedImage && (
                <div className="fixed inset-0 z-50 bg-black/90 flex flex-col" style={{ backdropFilter: 'blur(12px)' }}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <Crop size={20} className="text-yellow-400" />
                            <span className="text-white font-semibold text-lg">Crop Face Region</span>
                            <span className="text-gray-400 text-sm ml-2">Draw a rectangle around the face</span>
                        </div>
                        <button onClick={() => { setIsCropping(false); setUploadedImage(null); setCropRect(null) }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <X size={20} className="text-gray-400" />
                        </button>
                    </div>

                    {/* Crop area — takes up full available space */}
                    <div className="flex-1 relative overflow-hidden"
                        ref={cropContainerRef}
                        onMouseDown={onCropStart}
                        onMouseMove={onCropMove}
                        onMouseUp={onCropEnd}
                        onMouseLeave={onCropEnd}
                        style={{ cursor: 'crosshair' }}
                    >
                        <img
                            src={uploadedImage}
                            alt="Crop preview"
                            className="w-full h-full object-contain select-none pointer-events-none"
                            draggable={false}
                        />

                        {/* Dark mask + crop rectangle */}
                        {cropRect && getCropStyle() && (
                            <>
                                <div className="absolute inset-0 bg-black/60 pointer-events-none" />
                                <div
                                    className="absolute pointer-events-none border-2 border-yellow-400"
                                    style={{
                                        ...getCropStyle(),
                                        boxShadow: '0 0 0 9999px rgba(0,0,0,0.6), 0 0 20px rgba(250,204,21,0.3)',
                                        zIndex: 10,
                                    }}
                                >
                                    {/* Corner handles */}
                                    <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-yellow-400" />
                                    <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-yellow-400" />
                                    <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-yellow-400" />
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-yellow-400" />
                                    {/* Size label */}
                                    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[11px] text-yellow-400 font-mono bg-black/70 px-2 py-0.5 rounded whitespace-nowrap">
                                        {Math.round(getCropStyle()!.width)} × {Math.round(getCropStyle()!.height)}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Hint when no crop drawn */}
                        {!cropRect && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-black/80 px-6 py-3 rounded-xl border border-yellow-400/30 flex items-center gap-3">
                                    <Crop size={20} className="text-yellow-400" />
                                    <div>
                                        <p className="text-yellow-300 text-sm font-medium">Click & drag to select the face</p>
                                        <p className="text-gray-500 text-xs mt-0.5">Or click &quot;Skip&quot; below to use the full image</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom action bar */}
                    <div className="flex items-center justify-center gap-4 px-6 py-4 border-t border-white/10">
                        <button onClick={applyCrop}
                            className="flex items-center gap-2 px-6 py-2.5 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/50 rounded-lg text-yellow-300 text-sm font-semibold transition-all">
                            <Check size={16} />
                            {cropRect ? 'Crop & Analyze' : 'Analyze Full Image'}
                        </button>
                        <button onClick={skipCrop}
                            className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-gray-300 text-sm transition-all">
                            Skip — Use Full Image
                        </button>
                        <button onClick={() => setCropRect(null)}
                            className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/10 rounded-lg text-gray-500 text-sm transition-all">
                            Reset Selection
                        </button>
                    </div>
                </div>
            )}

            {/* ========== MAIN PANEL ========== */}
            <GlassPanel className="h-full flex flex-col p-4" intensity="medium">
                <h2 className="text-sm text-gray-300 uppercase tracking-widest mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                    <ImageIcon size={14} className="text-neon-cyan" />
                    Emotion Detection
                    <span className="ml-auto text-[10px] text-gray-500 normal-case tracking-normal">
                        Upload a face image to analyze
                    </span>
                </h2>

                <div className="flex-1 flex flex-col gap-3 overflow-auto">
                    {/* Upload Area */}
                    {!croppedImage ? (
                        <div
                            className={`flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${isDragging
                                ? 'border-neon-cyan bg-neon-cyan/10'
                                : 'border-white/20 hover:border-neon-cyan/50 hover:bg-white/5'
                                }`}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('file-input')?.click()}
                        >
                            <Upload size={32} className="text-gray-400" />
                            <div className="text-center">
                                <p className="text-sm text-gray-300">Drop a face image here or click to upload</p>
                                <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, WEBP</p>
                            </div>
                            <input
                                id="file-input"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileInput}
                            />
                        </div>
                    ) : (
                        <>
                            {/* Result Image */}
                            <div className="relative flex-1 min-h-[250px] bg-black/30 rounded-lg overflow-hidden border border-white/10">
                                <img
                                    ref={imgRef}
                                    src={displayImage || ''}
                                    alt="Result"
                                    className="w-full h-full object-contain"
                                />

                                {/* Bounding box + emotion overlay */}
                                {topEmotion && overlayStyle && !isLoading && (
                                    <>
                                        <div className="absolute pointer-events-none" style={{
                                            left: overlayStyle.left, top: overlayStyle.top,
                                            width: overlayStyle.width, height: overlayStyle.height,
                                            border: `2px solid ${emotionColor}`, borderRadius: 4,
                                            boxShadow: `0 0 12px ${emotionColor}80, inset 0 0 8px ${emotionColor}20`,
                                        }} />
                                        <div className="absolute pointer-events-none flex items-center gap-1.5"
                                            style={{ left: overlayStyle.left, top: Math.max(0, overlayStyle.top - 30) }}>
                                            <div className="px-2.5 py-1 rounded-md text-white font-bold text-sm shadow-lg"
                                                style={{ backgroundColor: emotionColor, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                                                {topEmotion.emotion}
                                            </div>
                                            <div className="px-2 py-1 rounded-md font-mono text-xs font-bold shadow-lg"
                                                style={{ backgroundColor: 'rgba(0,0,0,0.75)', color: emotionColor, border: `1px solid ${emotionColor}60` }}>
                                                {(topEmotion.confidence * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* fallback overlay without bounding box */}
                                {topEmotion && !overlayStyle && !isLoading && (
                                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                                        <div className="px-3 py-1.5 rounded-lg text-white font-bold text-lg shadow-lg"
                                            style={{ backgroundColor: `${emotionColor}cc`, backdropFilter: 'blur(8px)' }}>
                                            {topEmotion.emotion}
                                        </div>
                                        <div className="px-2.5 py-1.5 rounded-lg font-mono text-sm font-bold shadow-lg"
                                            style={{ backgroundColor: 'rgba(0,0,0,0.8)', color: emotionColor, border: `1px solid ${emotionColor}60` }}>
                                            {(topEmotion.confidence * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                )}

                                {/* Loading */}
                                {isLoading && (
                                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3">
                                        <Loader2 size={32} className="text-neon-cyan animate-spin" />
                                        <span className="text-sm text-neon-cyan font-mono">Analyzing face...</span>
                                    </div>
                                )}

                                {/* Controls */}
                                <div className="absolute top-2 right-2 flex gap-2">
                                    {heatmapImage && (
                                        <button onClick={() => setShowHeatmap(!showHeatmap)}
                                            className={`px-3 py-1 rounded text-xs text-white/90 transition-all border ${showHeatmap ? 'bg-red-500/40 border-red-400/50' : 'bg-black/70 border-white/20 hover:bg-black/90'}`}>
                                            {showHeatmap ? 'Original' : 'Heatmap'}
                                        </button>
                                    )}
                                    <button onClick={handleClear}
                                        className="px-3 py-1 bg-black/70 rounded text-xs text-white/90 hover:bg-black/90 transition-all border border-white/20">
                                        Clear
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-3">
                                    <p className="text-xs text-red-400">{error}</p>
                                </div>
                            )}

                            {/* Confidence bars */}
                            {prediction && topEmotion && (
                                <div className="space-y-1.5">
                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Confidence Scores</span>
                                    {prediction.map((pred) => (
                                        <div key={pred.emotion} className="flex items-center gap-2">
                                            <span className="text-[11px] text-gray-300 font-mono w-16 shrink-0">{pred.emotion}</span>
                                            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full transition-all duration-700"
                                                    style={{ width: `${pred.confidence * 100}%`, backgroundColor: EMOTION_COLORS[pred.emotion] || '#00f3ff' }} />
                                            </div>
                                            <span className="text-[11px] text-gray-400 font-mono w-12 text-right">{(pred.confidence * 100).toFixed(1)}%</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </GlassPanel>
        </>
    )
}
