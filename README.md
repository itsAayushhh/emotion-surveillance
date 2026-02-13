<div align="center">

<!-- Hero Banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0a0a20,50:00f3ff,100:bc13fe&height=220&section=header&text=SURVI&fontSize=80&fontColor=ffffff&fontAlignY=35&desc=Emotion%20Surveillance%20System&descSize=20&descAlignY=55&animation=fadeIn" width="100%" />

<br/>

<!-- Badges -->
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br/>

<p align="center">
  <strong>🧠 A real-time facial emotion recognition system powered by deep learning, featuring a cinematic dark-themed dashboard with 3D glassmorphism UI, Grad-CAM interpretability, and interactive data visualizations.</strong>
</p>

<br/>

<!-- Animated Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

</div>

<br/>

## 🎯 Overview

**SURVI** is an end-to-end emotion surveillance platform that combines a **custom-trained CNN model** on the **FER2013 dataset** with a stunning, production-grade dashboard. Upload any face image and get instant emotion predictions with confidence scores, Grad-CAM heatmap visualizations, face bounding boxes, and interactive analytics — all wrapped in a sleek cyberpunk-themed interface.

<br/>

<div align="center">

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   📸 Image Upload  →  🔍 Face Detection  →  🧠 CNN Model   │
│                                                             │
│   →  📊 Emotion Prediction  →  🔥 Grad-CAM Heatmap         │
│                                                             │
│   →  📈 Interactive Dashboard Visualizations                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

</div>

<br/>

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🧠 Deep Learning Engine
- Custom **CNN architecture** trained on FER2013
- **7 emotion classes**: Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral
- **Haar Cascade** face detection with adaptive fallback
- **Grad-CAM** heatmap visualization for model interpretability
- Confidence scores for all emotion classes

</td>
<td width="50%">

### 🎨 Cinematic Dashboard
- **Dark glassmorphism** UI with neon cyan/purple accents
- **3D interactive** auth page with perspective tilt effects
- **Animated particle** backgrounds and glowing orbs
- **Framer Motion** page transitions and micro-animations
- **Responsive** 2×2 grid layout with collapsible sidebar

</td>
</tr>
<tr>
<td width="50%">

### 📊 Analytics & Visualizations
- **Interactive bar charts** — per-class accuracy breakdown
- **Training curves** — loss/accuracy line charts per epoch
- **Confusion matrix** — class-wise prediction heatmap
- **Dataset overview** — class distribution and statistics
- **Waveform visualizer** — decorative audio-wave component

</td>
<td width="50%">

### 🔐 Auth & Architecture
- **JWT-based authentication** with signup/login
- **Next.js API routes** as backend proxy (no CORS issues)
- **FastAPI** Python backend for model inference
- **Image crop tool** — draw-to-select face region before analysis
- **Heatmap toggle** — switch between original and Grad-CAM view

</td>
</tr>
</table>

<br/>

<div align="center">
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">
</div>

<br/>

## 🏗️ Architecture

```mermaid
graph TB
    subgraph Frontend ["🖥️ Frontend — Next.js 16"]
        A[Auth Page<br/>3D Glassmorphism] --> B[Dashboard Layout<br/>Collapsible Sidebar]
        B --> C[Emotion Detection Panel<br/>Upload + Crop + Analyze]
        B --> D[Performance Panel<br/>Accuracy Metrics]
        B --> E[Training Analysis Panel<br/>Loss & Accuracy Curves]
        B --> F[Dataset Overview Panel<br/>Class Distribution]
    end

    subgraph API ["⚡ API Layer"]
        G[Next.js API Routes<br/>/api/predict, /api/auth/*]
    end

    subgraph Backend ["🐍 Backend — FastAPI"]
        H[FER2013 CNN Model<br/>TensorFlow/Keras]
        I[Face Detection<br/>OpenCV Haar Cascade]
        J[Grad-CAM Engine<br/>Heatmap Generation]
        K[Auth Service<br/>JWT Tokens]
    end

    C -->|Image Upload| G
    G -->|Proxy Request| H
    H --> I --> J
    A -->|Login/Signup| G
    G --> K

    style Frontend fill:#0a0a20,stroke:#00f3ff,color:#ffffff
    style API fill:#1a1a2e,stroke:#bc13fe,color:#ffffff
    style Backend fill:#0a0a20,stroke:#00f3ff,color:#ffffff
```

<br/>

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|:---:|:---:|:---|
| **Frontend** | Next.js 16, React 19, TypeScript | Core web framework & UI |
| **Styling** | Tailwind CSS 4, Custom CSS | Dark glassmorphism theme |
| **Animation** | Framer Motion | Page transitions & micro-interactions |
| **3D** | React Three Fiber, Three.js | 3D scene components |
| **Icons** | Lucide React | Consistent icon system |
| **Backend** | FastAPI, Uvicorn | REST API for model inference |
| **ML Model** | TensorFlow / Keras | FER2013 emotion classification CNN |
| **Vision** | OpenCV, Pillow | Face detection & image processing |
| **Data** | NumPy, Pandas, scikit-learn | Training data pipeline & evaluation |
| **Dataset** | FER2013 (via KaggleHub) | 35,887 grayscale 48×48 face images |

</div>

<br/>

<div align="center">
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">
</div>

<br/>

## 📁 Project Structure

```
emotion-surveillance/
│
├── emotion-dashboard/              # Main application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx            # Entry point — auth gate + dashboard
│   │   │   ├── layout.tsx          # Root layout with metadata
│   │   │   ├── globals.css         # Global styles & theme tokens
│   │   │   └── api/
│   │   │       ├── predict/        # POST /api/predict — emotion inference
│   │   │       └── auth/           # POST /api/auth/login & signup
│   │   │
│   │   ├── components/
│   │   │   ├── auth-page.tsx       # 3D interactive login/signup
│   │   │   ├── dashboard-layout.tsx# Sidebar + header layout
│   │   │   ├── panels/
│   │   │   │   ├── emotion-detection-panel.tsx  # Image upload + crop + analysis
│   │   │   │   ├── performance-panel.tsx        # Model accuracy metrics
│   │   │   │   ├── training-analysis-panel.tsx  # Training curves
│   │   │   │   └── dataset-overview-panel.tsx   # Dataset statistics
│   │   │   ├── visualizations/
│   │   │   │   ├── bar-chart.tsx       # Interactive bar chart
│   │   │   │   ├── line-chart.tsx      # Multi-line training chart
│   │   │   │   ├── confusion-matrix.tsx# Heatmap confusion matrix
│   │   │   │   ├── heatmap.tsx         # Generic heatmap component
│   │   │   │   └── waveform.tsx        # Animated waveform
│   │   │   └── ui/
│   │   │       └── glass-panel.tsx     # Reusable glassmorphism container
│   │   │
│   │   └── lib/
│   │       ├── auth-context.tsx    # React context for auth state
│   │       ├── auth-helpers.ts     # Token management utilities
│   │       ├── mock-data.ts        # Fallback data & color mappings
│   │       └── types.ts            # TypeScript interfaces
│   │
│   ├── backend/
│   │   ├── main.py                 # FastAPI server — prediction + Grad-CAM
│   │   ├── auth.py                 # JWT auth service
│   │   ├── train_model.py          # FER2013 CNN training script
│   │   ├── requirements.txt        # Python dependencies
│   │   └── model/                  # Trained model artifacts
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts
│
├── .gitignore
└── README.md
```

<br/>

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **Python** ≥ 3.10
- **npm** or **yarn**

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/itsAayushhh/emotion-surveillance.git
cd emotion-surveillance
```

### 2️⃣ Setup Frontend

```bash
cd emotion-dashboard
npm install
```

### 3️⃣ Setup Backend

```bash
cd backend
pip install -r requirements.txt
```

### 4️⃣ Train the Model *(first time only)*

```bash
python train_model.py
```

> This downloads the FER2013 dataset from Kaggle, trains the CNN, and saves the model + metrics to the `model/` directory.

### 5️⃣ Start the Backend Server

```bash
python main.py
```

The API will be available at `http://localhost:8000`

### 6️⃣ Start the Frontend

```bash
# In the emotion-dashboard directory
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

<br/>

<div align="center">
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">
</div>

<br/>

## 🧪 API Endpoints

| Method | Endpoint | Description |
|:---:|:---|:---|
| `GET` | `/` | Health check — model status |
| `POST` | `/predict` | Upload image → get emotion prediction + Grad-CAM |
| `POST` | `/auth/signup` | Create new user account |
| `POST` | `/auth/login` | Authenticate and receive JWT token |
| `GET` | `/auth/me` | Get current user from Bearer token |
| `GET` | `/metrics` | Training metrics & confusion matrix |
| `GET` | `/training-history` | Per-epoch accuracy & loss history |

<br/>

## 🎭 Supported Emotions

<div align="center">

| Emotion | Color | Description |
|:---:|:---:|:---|
| 😠 **Angry** | 🔴 `#ff4444` | Expressions of anger or frustration |
| 🤢 **Disgust** | 🟢 `#44ff44` | Expressions of disgust or displeasure |
| 😨 **Fear** | 🟣 `#ff44ff` | Expressions of fear or anxiety |
| 😊 **Happy** | 🟡 `#ffff44` | Expressions of happiness or joy |
| 😢 **Sad** | 🔵 `#4444ff` | Expressions of sadness or sorrow |
| 😲 **Surprise** | 🟠 `#ff8844` | Expressions of surprise or shock |
| 😐 **Neutral** | ⚪ `#aaaaaa` | Neutral or baseline expressions |

</div>

<br/>

## 🔬 Model Details

<div align="center">

```
╔══════════════════════════════════════════════╗
║           FER2013 CNN Architecture           ║
╠══════════════════════════════════════════════╣
║                                              ║
║   Input: 48×48×1 (Grayscale)                 ║
║       ↓                                      ║
║   Conv2D → BatchNorm → ReLU → MaxPool        ║
║       ↓                                      ║
║   Conv2D → BatchNorm → ReLU → MaxPool        ║
║       ↓                                      ║
║   Conv2D → BatchNorm → ReLU → MaxPool        ║
║       ↓                                      ║
║   Flatten → Dense → Dropout                  ║
║       ↓                                      ║
║   Dense(7) → Softmax                         ║
║       ↓                                      ║
║   Output: 7 Emotion Probabilities            ║
║                                              ║
╚══════════════════════════════════════════════╝
```

</div>

- **Dataset**: FER2013 — 35,887 labeled face images (48×48 grayscale)
- **Classes**: 7 (Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral)
- **Interpretability**: Grad-CAM heatmaps highlighting facial regions that drive predictions
- **Face Detection**: OpenCV Haar Cascade with adaptive parameters and fallback

<br/>

## 🎨 Design Philosophy

<div align="center">

| Principle | Implementation |
|:---|:---|
| **Dark Cyberpunk** | Deep navy/black backgrounds with neon cyan (`#00f3ff`) and purple (`#bc13fe`) accents |
| **Glassmorphism** | Frosted glass panels with `backdrop-blur`, subtle borders, and transparency |
| **3D Interactions** | Perspective-transform card tilts on mouse movement, animated 3D logo rotation |
| **Micro-Animations** | Framer Motion staggered reveals, hover scale effects, smooth transitions |
| **Particle Effects** | Floating animated particles with randomized paths and glow orbs |
| **Data Density** | 2×2 grid layout maximizing information display across 4 interactive panels |

</div>

<br/>

<div align="center">
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">
</div>

<br/>

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

<br/>

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<br/>

## 👤 Author

<div align="center">

**Aayush Patel**

[![GitHub](https://img.shields.io/badge/GitHub-itsAayushhh-181717?style=for-the-badge&logo=github)](https://github.com/itsAayushhh)

</div>

<br/>

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0a0a20,50:00f3ff,100:bc13fe&height=120&section=footer&animation=fadeIn" width="100%" />

<br/>

<sub>Built with 🧠 intelligence and 💜 passion</sub>

</div>
