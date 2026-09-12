<h1 align="center">AdaptX Engine</h1>
<h1 align="center">Adaptive Layout Engine for Multi-Surface Ads</h1>

<p align="center">
  <span style="color: #ffffff;"><b>Live Application:</b></span>
  <a href="https://adapt-x-engine.vercel.app/">https://adapt-x-engine.vercel.app/</a>
  <br>
  <span style="color: #ffffff;"><b>GitHub Repository:</b></span>
  <a href="https://github.com/SonaRajarajan/AdaptX-Engine">https://github.com/SonaRajarajan/AdaptX-Engine</a>
</p>

<br>

<div align="center">

<b>Name : V R Sona</b>
<br>
<b>Reg No: 22MIA1161</b>

</div>


## Quick Start Execution

Run both the Real-Time Backend API and AdaptX Engine Frontend concurrently with a single command:

```bash
# 1. Clone the repository
git clone https://github.com/SonaRajarajan/AdaptX-Engine.git
cd AdaptX-Engine

# 2. Run both Frontend & Backend concurrently
./run_app.sh
```

- **Deployed Live Vercel Web App:** https://adapt-x-engine.vercel.app/
- **API Health Check:** http://localhost:8000/api/health

---

## System Architecture

```mermaid
flowchart TD
    classDef ui fill:#8B5CF6,stroke:#7C3AED,stroke-width:2px,color:#FFFFFF
    classDef engine fill:#EC4899,stroke:#DB2777,stroke-width:2px,color:#FFFFFF
    classDef render fill:#14B8A6,stroke:#0D9488,stroke-width:2px,color:#FFFFFF
    classDef store fill:#3B82F6,stroke:#2563EB,stroke-width:2px,color:#FFFFFF
    classDef worker fill:#F59E0B,stroke:#D97706,stroke-width:2px,color:#FFFFFF
    classDef backend fill:#FF5722,stroke:#E64A19,stroke-width:2px,color:#FFFFFF

    subgraph Client ["Frontend Architecture (React 18 + TypeScript + Vite)"]
        UI["UI Layer (Wizard Stepper, Campaign Editor, Surface Selector)"]:::ui
        LayoutEngine["Auto-Layout Engine (Evolutionary Layout Scorer, Focal Point Cropper, Constraint Solver)"]:::engine
        Renderers["Rendering Engine (AdaptiveAdRenderer, VideoAdRenderer, RealWorld3DFrame)"]:::render
        Store["State Management Layer (Zustand Stores: useAdaptXStore, useCanvasStore)"]:::store
        Workers["Web Workers (Spatial Indexing & Layout Workers)"]:::worker
    end

    subgraph Backend ["Backend Gateway (Node.js API)"]
        APIServer["API Gateway & Layout Service"]:::backend
        CampaignStore["Campaign & Preset Persistence"]:::backend
    end

    style Client fill:#FFFFFF,stroke:#CBD5E1,stroke-width:2px,color:#0F172A
    style Backend fill:#FFFFFF,stroke:#CBD5E1,stroke-width:2px,color:#0F172A

    UI --> Store
    LayoutEngine --> Store
    Store --> Renderers
    Workers --> LayoutEngine
    Store <--> APIServer
```

---

## Features

- **Multi-Surface Adaptation**: Real-time reflowing across (9:16, 16:9, 1:1, 32:9, 4:5, 3:4, Smartwatch, Cockpit).
- **Static Poster Ad Renderer**: Smart typography hierarchy, focal point cropper & custom shape cuts.
- **Video Commercial Ads Engine**: 12 commercial presets with motion dynamics, particle physics & animated glitch effects.
- **3D Spatial Environment Simulator**: Preview ads rendered as real-world 3D devices (iPhone 16 Pro, MacBook, 4K TV, City Billboard).
- **Integrated Export Engine**: 1-click PNG image export for static posters and 1-click MP4 commercial video export.
- **A/B Comparison & Layout Genome**: Side-by-side creative variation matrix and raw layout DNA parameter inspector.
- **Automated Accessibility Audit**: Real-time WCAG color contrast auditing and font legibility constraint checks.
- **Multi-Vibe Aesthetic Engine**: Instant design theme switching (Neobrutalist, Cyberpunk, Organic Pastel, Glassmorphism, Clean).

---

## Application Screenshots

# 1. Homepage of Multi-Surface Ads Platform
<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/f124b103-5c28-45bb-8219-64314f8e1d31" />

# > Static Poster Ad Editor
<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/20a3a486-ee87-4ec2-83e4-50b8d9b8ea4a" />

# > Video Commercial Ad Builder
<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/a14c50e5-99a8-46ba-baee-6b0872ba5d28" />

# 2. Multi-Surface Geometry Format Selection
<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/85cd6924-9976-473e-a376-58af49d8a012" />

# 3. AI-Powered Adaptive Template Generation
<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/bfee90f7-068f-4e0e-bfb2-bb43303f3926" />

# 4. Motion Preset & Animation Selection 
<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/5259db59-0a6e-4a37-9bb9-81c4815ce43a" />

# 5. Campaign Setup & Product Configuration with Cursor Drag
<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/b4beac31-0a94-4697-8cd4-902318dc1ea3" />

# 7. 3D Real-World Ad Preview
# > Phone
<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/f28bbd27-2397-40ff-a102-2ecb0f7f3bbb" />

# > Smartwatch
<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/09202f42-e214-44f6-8b70-406c5f5adab3" />

# 8. Layout Genome & Parameter Inspector
<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/dd3b6d57-ad10-4103-9177-030fc4a9801d" />

# 9. Adaptive Multi-Surface Ads
<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/97814aa7-ff36-4eb2-93ef-963a744e4d57" />

# 10. A/B Creative Variation Comparison
<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/55642ced-3704-4ed8-a530-a3a5045bf31a" />

# 11. Multi-Vibe Theme & Aesthetic Selection
<img width="1452" height="228" alt="image" src="https://github.com/user-attachments/assets/446bc233-935e-4a52-baa5-be8d7816e2a6" />

# 12. Dynamic Typography & Focal Point Adjustment
<img width="465" height="161" alt="image" src="https://github.com/user-attachments/assets/00c77f96-74c3-42d8-91cd-81377371b7af" />

# 13. Save and Download Campaign & Surface Presets
<img width="1415" height="397" alt="image" src="https://github.com/user-attachments/assets/4e08af7a-0d44-4c58-b8bb-033fb50635ae" />


---

## Core Platform Capabilities

### 1. Multi-Surface Contextual Adaptation
- Automatically scales and reflows creative assets across 8 distinct device aspect ratios (9:16 Portrait, 16:9 Landscape, 1:1 Square, 32:9 Ultra-wide, etc.).
- Evaluates visual contrast, legibility, and WCAG accessibility standards for each surface.

### 2. Static & Video Commercial Modes
- **Static Poster Mode**: Custom brand color themes, typography hierarchy, product shape cuts, and 3D product popout effects.
- **Video Ads Mode**: 12 commercial presets with motion styles including Holographic Glitch, 360 Degree Orbit, Bounce & Float, Zoom Pulse, and Shimmer Glare.

### 3. Integrated Save & Export Engine
- 1-click PNG image export for static poster layouts.
- 1-click MP4 video export for animated video commercials.
- Direct campaign state saving and surface preset persistence.

---

## Frontend Architecture Overview

- **Campaign Composer** (`Step1CampaignSetup.tsx`): Interactive setup wizard for products, geometry, templates, and motion controls.
- **3D Spatial Simulator** (`DeviceRealWorldModal.tsx`): Real-time 3D spatial device modal with 8 environment presets & 2D/3D popouts.
- **Static Poster Renderer** (`AdaptiveAdRenderer.tsx`): Dynamic poster rendering with brand typography & geometric shape cuts.
- **Video Commercial Renderer** (`VideoAdRenderer.tsx`): High-framerate canvas animation engine with particle physics & MP4 export.
- **Auto-Layout Intelligence** (`src/engine/`): Candidate scoring, constraint solver, smart typography scaling & evolutionary generator.
- **Unified State Store** (`useAdaptXStore.ts`): Central Zustand state tracking active campaign, video presets & themes.

---
## Automated Test Suite

Run the Vitest test suite to verify layout engine calculations and constraint solvers:

```bash
cd frontend
npm test
```

<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/4d838a88-67cf-4602-adef-0d3936f41c25" />


Tested Engine Modules:
- `FocalPointCropper.test.ts`: Smart cropping focal point detection and aspect ratio fitting.
- `ConstraintSolver.test.ts`: Brand guideline and aspect ratio constraint verification.
- `LayoutScoring.test.ts`: Visual hierarchy score metrics calculation.
- `ThemeEngine.test.ts`: Color contrast audit calculations.

---

## Performance Benchmarks

| Metric | Target Benchmark | AdaptX Measured Result |
| :--- | :---: | :---: |
| **Canvas Render Speed** | 60 FPS | **60 FPS** |
| **Spatial Layout Calculation** | <10 ms | **~1.8 ms** |
| **Surface Adaptation Time** | <50 ms | **~12 ms** |
| **Initial Bundle Load** | <2 sec | **~0.4 sec** |

---

## Docker Deployment

Deploy full stack using Docker Compose:

```bash
docker-compose up --build
```
