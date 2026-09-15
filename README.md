# Media Compressor | Electron Video Optimization Suite

![Electron](https://img.shields.io/badge/Electron-v35-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-v20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![FFmpeg](https://img.shields.io/badge/Engine-HandBrakeCLI-orange?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

A high-performance desktop application designed for batch video compression and codec optimization. Built on the Electron framework, this tool provides a streamlined "drag-and-drop" interface for transforming high-bitrate raw footage into web-optimized **H.265 (HEVC)** media.

---

## Key Features

*   **Batch Processing Engine:** Leverages `fast-glob` to recursively scan directories and queue multiple `MP4` and `MKV` files for sequential processing.
*   **Intuitive UX:** Minimalist drag-and-drop zone with real-time logging and progress tracking.
*   **H.265 Optimization:** Pre-configured for **x265 encoding** with a Balanced Quality (CRF 23) profile, significantly reducing file size while preserving visual fidelity.
*   **Secure Execution:** Implements Electron best practices, including `contextIsolation` and a dedicated `preload` script to bridge the gap between the Render process and Node.js primitives safely.

---

## Technical Architecture

The application follows the **Electron Main/Renderer process model**, ensuring the UI remains responsive even during heavy I/O operations.

*   **Main Process (`main.js`):** Manages the application lifecycle, window state, and secure IPC handlers for filesystem access.
*   **Preload Layer (`preload.js`):** Uses `contextBridge` to expose only necessary API endpoints to the frontend, adhering to the principle of least privilege.
*   **Compression Logic (`compress.js`):** Interfaces directly with the system's `HandBrakeCLI` binary via Node.js `child_process`. It handles shell execution and captures standard error/output for real-time status reporting.
*   **UI Layer (`renderer.js`):** Handles DOM manipulation, event listeners for the file drop-zone, and asynchronous communication with the backend.

---

## Core Logic

The encoding engine utilizes the following technical string to maximize compression efficiency:

```bash
HandBrakeCLI -i [input] -o [output] -e x265 -q 23 -E av_aac --audio-bitrate 128 --optimize
```
*   **-e x265:** Modern HEVC compression.
*   **-q 23:** Constant Rate Factor for consistent quality.
*   **--optimize:** Optimizes the MP4 container for web streaming (moves metadata to the start of the file).

---

## Installation & Setup

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   [HandBrakeCLI](https://handbrake.fr/downloads2.php) (Must be added to your system PATH)

### 1. Clone & Install
```bash
git clone https://github.com/ChefAsmith/VideoCompress.git
cd VideoCompress
npm install
```

### 2. Run in Development
```bash
npm start
```

### 3. Build for Production
```bash
npm run build
```

---

## Future Roadmap

*   **Multi-Threading:** Support for parallel encoding instances based on CPU core count.
*   **Custom Profiles:** A settings UI to allow users to select between H.264, H.265, and AV1.
*   **Notification Integration:** Native OS notifications upon completion of a batch queue.

---

## License
Distributed under the **MIT License**. Created as a demonstration of native system interfacing and desktop UI design.

**Maintainer:** *ChefAmbrosia* – Backend & Infrastructure Developer