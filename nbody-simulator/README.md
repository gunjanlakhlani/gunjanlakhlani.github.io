# ✨ Gravitational N-Body Simulator

A high-performance gravitational N-Body simulator built with **WebGL** and **JavaScript Web Workers**, capable of simulating and rendering up to **100,000 interacting particles** at 100 FPS directly in the browser.

<p align="center">
  <img src="https://raw.githubusercontent.com/gunjanlakhlani/gunjanlakhlani.github.io/feature/nbody-webgl-worker/assets/images/nbody-preview.png" alt="100K Particle Simulation Preview" width="100%" />
</p>

## 🚀 Features

- **Massive Scale**: Simulates classic 2-body orbits, medium clusters, all the way up to 100,000 particle Plummer spheres.
- **Hardware Accelerated**: Uses a custom WebGL point sprite pipeline (`gl.POINTS`) with additive blending to maximize GPU throughput while maintaining beautiful glowing particle aesthetics.
- **Off-Thread Physics**: The raw mathematical crunching is completely decoupled from the UI. An asynchronous Web Worker executes the physics, preventing the browser window from freezing even under extreme computational load.
- **Optimized Barnes-Hut Algorithm**: 
  - Generates quadtrees with capacities of up to 4 million nodes.
  - Dynamically adjusts approximation precision ($\theta$) based on particle density to aggressively optimize deep-tree traversal times.
  - Implements fast inverse-square-root proxy algorithms for distance calculations to prevent nested floating-point bottlenecks.
- **Leapfrog Integration**: Maintains incredible energy conservation accuracy (symplectic integration), computing exact initial energies bounds ($E_0$) to monitor chaotic drift over time.
- **Fully Interactive UI**: Click to place bodies, click-and-drag to fire them like a slingshot with initial velocities, and slide configuration parameters seamlessly.

## 🛠️ Technical Architecture

This application utilizes a dual-canvas paradigm to achieve rendering speed without sacrificing clean, sharp UI lines:
1. **`gl-canvas`**: A lower layer running raw WebGL. The fragment and vertex shaders are highly compressed to execute a single draw call spanning the entire particle data array buffers.
2. **`overlay-canvas`**: A higher transparent Canvas 2D layer sitting directly on top. It renders the UI elements—the orbital trail histories, aiming arrows, grid lines, and the Center of Mass tracker crosshairs—keeping the UI elements pixel-perfect.

The **Structure-of-Arrays (SoA)** memory layout dictates the logic inside `physics-worker.js`. Instead of classical JavaScript objects (`{x, y, vx, vy}`), massive TypedArrays (`Float64Array`) are constructed to feed V8's JIT compiler consecutive memory blocks, virtually eliminating Garbage Collection (GC) pauses during integration.

## 💻 Running Locally

Because this project uses Web Workers (which enforce strict cross-origin policies), you cannot simply double click the `index.html` file to run it via the `file://` protocol. 

1. **Clone the branch**:
   ```bash
   git clone -b feature/nbody-webgl-worker https://github.com/gunjanlakhlani/gunjanlakhlani.github.io.git
   cd gunjanlakhlani.github.io/nbody-simulator
   ```
2. **Launch a fast local server**:
   ```bash
   npx serve .
   # or using python: python3 -m http.server 3000
   ```
3. **Open Simulator**: Navigate to `http://localhost:3000/`

## 🕹️ Controls
* **Scroll** to Zoom In/Out.
* **Right-Click + Drag** to Pan the Camera.
* **Left-Click** to place a massive body, or **Left-Click + Drag** to launch a body with a specific initial velocity vector.
* **Presets Console**: Instantly load beautiful structural presets like planetary figure-8s or chaotic globular clusters.

---
*Built as a high-performance optimization branch for the core Physics Engine.*
