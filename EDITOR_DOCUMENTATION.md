# 🎨 T-Shirt Customizer & Canvas Editor - Complete Technical Documentation

Yeh document hamare **T-Shirt Design Studio / Editor** (`/design`) ka mukammal technical overview aur architecture guide hai. Ismein editor mein use hone wali tamam libraries, algorithms, state management aur features ki tafseelat darj hain.

---

## 📑 Table of Contents
1. [Overview & Purpose](#-overview--purpose)
2. [Tech Stack & Libraries Used](#-tech-stack--libraries-used)
3. [Project File Structure](#-project-file-structure)
4. [Core Architectural Modules & Features](#-core-architectural-modules--features)
   - [1. Fabric.js Interactive Canvas](#1-fabricjs-interactive-canvas-engine)
   - [2. Multi-View System (Front, Back, Left, Right)](#2-multi-view-system-front-back-left-right)
   - [3. Realistic Dynamic Shirt Recoloring Engine](#3-realistic-dynamic-shirt-recoloring-engine)
   - [4. Advanced Typography & Google Fonts Loading](#4-advanced-typography--google-fonts-loading)
   - [5. Vector Clipart System (2,000+ Icons)](#5-vector-clipart-system-2000-icons)
   - [6. Custom Image Uploading](#6-custom-image-uploading)
   - [7. Dynamic Live Pricing Engine](#7-dynamic-live-pricing-engine)
   - [8. Offscreen Composite Image Generation & Export](#8-offscreen-composite-image-generation--export)
   - [9. Checkout & Session State Integration](#9-checkout--session-state-integration)
5. [Summary Table of Libraries & Packages](#-summary-table-of-libraries--packages)

---

## 🌟 Overview & Purpose

**T-Shirt Design Studio** ek full-featured, client-side interactive product customization tool hai. Iske zariye users:
- T-Shirt ka color realtime mein change kar sakte hain (realistic fabric texture aur shadows ke sath).
- 4 mukhtalif sides (**Front, Back, Left Sleeve, Right Sleeve**) par independently design bana sakte hain.
- Custom text add kar sakte hain (multiple fonts, colors, outline stroke, shadows, spacing, alignment ke sath).
- 2000+ vector clipart icons browse aur recolor kar sakte hain.
- Apni custom images upload aur resize/rotate kar sakte hain.
- Real-time pricing breakdown dekh sakte hain based on print locations & layer types.
- High-resolution composite preview dekh sakte hain aur batch PNG files download kar sakte hain.
- Seamlessly custom artwork aur size breakdown ke sath checkout step par transfer ho sakte hain.

---

## 🛠 Tech Stack & Libraries Used

| Library / Tool | Version | Category | Purpose |
|---|---|---|---|
| **Fabric.js (`fabric`)** | `^7.4.0` | Core Canvas Engine | HTML5 Canvas abstraction, object manipulation (drag, rotate, scale, z-index, text, SVG groups, images). |
| **Next.js** | `16.2.11` | Framework (App Router) | Dynamic client-side routing, Next Dynamic component loading (`ssr: false`). |
| **React & React-DOM** | `19.2.4` | UI Library | Component hierarchy, hooks (`useState`, `useEffect`, `useCallback`, `useRef`). |
| **HTML5 Canvas 2D API** | Native Browser API | Image Compositing | `globalCompositeOperation` (`source-in`, `multiply`, `source-over`) for realistic color blending and texture masking. |
| **Lucide React (`lucide-react`)** | `^1.26.0` | UI Icons | Modern SVG icons for tabs, alignments, text formatting, downloads, preview modal, etc. |
| **Tabler Icons (`@tabler/icons`)** | `^3.45.0` | Clipart Icons | Vector icon data used in SVG clipart library. |
| **FontFace Browser API** | `document.fonts.load` | Web Fonts | Asynchronous font preloading for Fabric.js text rendering. |
| **HTML2Canvas (`html2canvas`)** | `^1.4.1` | Screenshot Tool | Screen capturing utility. |
| **TypeScript** | `^5` | Type Safety | Strict typing for canvas states, clipart items, view types, pricing breakdown. |
| **CSS Modules (`Design.module.css`)** | Vanilla CSS | Styling | Scoped, responsive UI styling for sidebar, canvas area, toolbar, modals. |

---

## 📂 Project File Structure

```
src/
├── app/
│   ├── design/
│   │   ├── page.tsx               # Main Design Studio Page (Toolbar, Tabs, State, Modals)
│   │   ├── Design.module.css      # Scoped Styles for Editor UI
│   │   ├── clipartData.ts         # 2,000+ Categorized SVG Icons Data
│   │   └── scraped-icons.json     # Additional Scraped Clipart Vectors
│   └── checkout/
│       └── PaymentStep.tsx        # Checkout page consuming artwork & price payload
├── components/
│   └── DesignerCanvas.tsx         # Client-only Fabric.js Canvas wrapper component
└── public/
    └── templates/
        ├── shirt-front.png        # Front Shirt Template (Transparent Mask & Creases)
        ├── shirt-back.png         # Back Shirt Template
        ├── shirt-left.png         # Left Sleeve Shirt Template
        └── shirt-right.png        # Right Sleeve Shirt Template
```

---

## 🧩 Core Architectural Modules & Features

### 1. Fabric.js Interactive Canvas Engine
- **File**: `src/components/DesignerCanvas.tsx` & `src/app/design/page.tsx`
- **Details**:
  - `next/dynamic` ke sath `ssr: false` use kiya gaya hai taake server-side render par `window` / `canvas` error na aaye.
  - Fabric canvas object selection, scaling handles, rotation cursors, aur boundary controls manage karta hai.
  - `preserveObjectStacking: true` ensure karta hai ke active object select karte waqt z-index glitch na kare.
  - Canvas events listen kiye gaye hain: `selection:created`, `selection:updated`, `selection:cleared`, `object:modified`, `object:added`, `object:removed`.

### 2. Multi-View System (Front, Back, Left, Right)
- **State**: `canvasStates: Record<ViewType, any>`
- **Views**: `'front' | 'back' | 'left' | 'right'`
- **Workflow**:
  - Har view ka canvas JSON format (`canvas.toJSON(['sourceType'])`) mein preserve hota hai.
  - View switch karte waqt current view ka state serialize hoke `sessionStorage` aur memory mein store hota hai.
  - Target view ka state `canvas.loadFromJSON()` ke through seamlessly restore kiya jata hai.

### 3. Realistic Dynamic Shirt Recoloring Engine
- **Methodology**: HTML5 2D Canvas Compositing with Multi-Pass Blend Modes.
- **Workflow**:
  1. Base shirt template image load hoti hai.
  2. Canvas par shirt image draw hoti hai.
  3. `ctx.globalCompositeOperation = 'source-in'` use karke chosen hex color ka tint apply hota hai (shirt ke exact boundaries ke andar).
  4. `ctx.globalCompositeOperation = 'multiply'` use karke original shirt template ko dubara multiply blend mode ke sath upar draw kiya jata hai. Is se shirt ke real shadows, folds aur fabric creases bilkul natural nazar aate hain.
  5. `ctx.globalCompositeOperation = 'source-over'` use karke user ka design/text/clipart top layer par render hota hai.

### 4. Advanced Typography & Google Fonts Loading
- **Fonts Available**: 29+ fonts categorized across **Standard**, **Handwriting / Script**, **Sci-Fi / Modern**, **College / Sports**, **Retro / Vintage**, **Serif / Old Style**.
- **Dynamic Preloader**:
  ```ts
  document.fonts.load(`16px "${fontFamily}"`).then(() => {
    activeObject.set('fontFamily', fontFamily);
    canvas.requestRenderAll();
  });
  ```
- **Formatting Controls**:
  - Font Size & Family
  - Fill Color & Outline Stroke Color + Width
  - Character / Letter Spacing
  - Text Alignment (Left, Center, Right)
  - Font Styles (Bold, Italic, Underline)
  - Drop Shadows (Color, Blur, X/Y Offset)

### 5. Vector Clipart System (2,000+ Icons)
- **Data Files**: `clipartData.ts` + `scraped-icons.json`
- **Categories**: Animals, Fantasy, Weapons, Items, Nature, Magic, People, Misc, etc.
- **SVG Parsing**:
  - `fabric.loadSVGFromString()` ke through raw SVG string ko parse karke fabric path/group mein convert kiya jata hai.
  - `fabric.util.groupSVGElements()` se groups generate hote hain.
  - **Coloring Engine**: SVGs ke fill/stroke ko analyze karke bounding boxes (jahan `fill="none"` hota hai) ko preserve kiya jata hai aur actual graphic paths ko selected color ke mutabiq dynamically tint kiya jata hai.

### 6. Custom Image Uploading
- **Workflow**:
  - `FileReader.readAsDataURL()` se local image read hoti hai.
  - `fabric.FabricImage.fromURL()` se image fabric canvas par add hoti hai.
  - Auto-scaling (`img.scaleToWidth(200)`) aur positioning handle hoti hai.
  - Layer tracking ke liye `sourceType: 'upload'` assign hota hai.

### 7. Dynamic Live Pricing Engine
- **Rules & Calculation**:
  - **Base Shirt Cost**: `$6.98`
  - **Front View**: Text/Clipart = `+$5.02`, Upload = `+$6.02`
  - **Back View**: Text/Clipart = `+$6.02`, Upload = `+$7.02`
  - **Sleeves (Left / Right)**: Text/Clipart/Upload = `+$1.50`
  - **Quantity Calculator**: Sizes (S, M, L, XL, 2XL, 3XL) ka total quantity multiplier apply hota hai.

### 8. Offscreen Composite Image Generation & Export
- **Functions**: `generateImageForView(view)` & `handleSaveDesign()`
- **High Performance Offscreen Rendering**:
  - Har view ko export karne ke liye user ko view switch karne ki zaroorat nahi parti.
  - Background mein `fabric.StaticCanvas` off-screen element par JSON load karke composite PNG generate karta hai.
  - User direct **PNG Download** kar sakta hai ya **Batch Download** (all 4 sides ek sath) kar sakta hai.

### 9. Checkout & Session State Integration
- **Payload Generation**:
  - Har side ka final composite image (shirt + color + artwork).
  - Print artwork se unique hex colors extract kiye jate hain (screen printing / DTG reference ke liye).
  - Quantities aur pricing breakdown `sessionStorage.setItem('checkoutState', ...)` mein save hota hai.
  - `router.push('/checkout')` ke through user direct payment step par chala jata hai.

---

## 📊 Summary Table of Libraries & Packages

```
onedigital-sol / Design Studio Stack:
├── fabric: ^7.4.0             --> Canvas 2D engine, object model, SVG & image manipulation
├── next: 16.2.11              --> Dynamic client imports (ssr: false), App routing
├── react: 19.2.4              --> UI State management & hooks
├── lucide-react: ^1.26.0      --> Studio UI tool icons
├── @tabler/icons: ^3.45.0     --> Vector Clipart icons database
├── html2canvas: ^1.4.1        --> Viewport rasterization
└── Canvas 2D API              --> Multi-layer blend modes (source-in, multiply)
```

---
*Documentation generated for onedigital-sol project.*
