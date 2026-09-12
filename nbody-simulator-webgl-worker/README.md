# N-Body Gravity Lab

An entirely static, browser-based gravitational N-body simulator. This is the canonical simulator linked from the main site and can be served directly by GitHub Pages.

## Architecture

- `index.html` owns the interface, camera, trails, presets, and WebGL renderer.
- `physics-worker.js` owns simulation state, force calculation, and fixed-timestep leapfrog integration in a Web Worker.
- `nbody.c` is the standalone C reference implementation used to compare the numerical method with the browser version.

Small systems use direct pairwise summation. Systems above 200 bodies use a Barnes–Hut quadtree. Exact total-energy diagnostics are limited to 500 bodies because calculating potential energy directly is quadratic even when the force step uses the tree.

## Run locally

The worker requires an HTTP origin, so opening `index.html` as a `file://` URL will not work reliably.

```sh
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/nbody-simulator-webgl-worker/`.

## Controls

- Click or drag on the canvas to add a body and choose its velocity.
- Scroll to zoom; middle- or right-drag to pan.
- Press Space to play or pause, `S` for one step, and `R` to reset the camera.

The simulation uses dimensionless units with `G = 1` and fixed Plummer-style softening. Presets are demonstrations, not ephemerides.
