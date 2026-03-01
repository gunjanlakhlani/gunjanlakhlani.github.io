// ═══════════════════════════════════════════════════════════════════
// N-Body Physics Worker
// Runs Barnes-Hut + Leapfrog off the main thread
// ═══════════════════════════════════════════════════════════════════

const G = 1.0;
const SOFTENING = 1e-4;
const BH_THETA = 0.7;
const BH_THRESHOLD = 200;

// Flat arrays for performance (SoA layout)
let N = 0;
let x, y, vx, vy, ax, ay, mass;
let simTime = 0;

// ─── Barnes-Hut Quadtree (pool-allocated for zero GC) ──────────
const MAX_NODES = 4000000;
let nodeCx = new Float64Array(MAX_NODES);
let nodeCy = new Float64Array(MAX_NODES);
let nodeHalf = new Float64Array(MAX_NODES);
let nodeMass = new Float64Array(MAX_NODES);
let nodeComX = new Float64Array(MAX_NODES);
let nodeComY = new Float64Array(MAX_NODES);
let nodeCount = new Int32Array(MAX_NODES);
let nodeBody = new Int32Array(MAX_NODES);
// Children: 4 ints per node (NW, NE, SW, SE), -1 means no child
let nodeChildren = new Int32Array(MAX_NODES * 4);
let nodePoolSize = 0;

function allocNode(cx, cy, half) {
    if (nodePoolSize >= MAX_NODES) return -1;
    const id = nodePoolSize++;
    nodeCx[id] = cx;
    nodeCy[id] = cy;
    nodeHalf[id] = half;
    nodeMass[id] = 0;
    nodeComX[id] = 0;
    nodeComY[id] = 0;
    nodeCount[id] = 0;
    nodeBody[id] = -1;
    const ci = id * 4;
    nodeChildren[ci] = -1;
    nodeChildren[ci + 1] = -1;
    nodeChildren[ci + 2] = -1;
    nodeChildren[ci + 3] = -1;
    return id;
}

function getQuadrant(nid, px, py) {
    if (px < nodeCx[nid]) {
        return py >= nodeCy[nid] ? 0 : 2;
    } else {
        return py >= nodeCy[nid] ? 1 : 3;
    }
}

function subdivide(nid) {
    const hs = nodeHalf[nid] * 0.5;
    const cx = nodeCx[nid], cy = nodeCy[nid];
    const ci = nid * 4;

    const nw = allocNode(cx - hs, cy + hs, hs);
    const ne = allocNode(cx + hs, cy + hs, hs);
    const sw = allocNode(cx - hs, cy - hs, hs);
    const se = allocNode(cx + hs, cy - hs, hs);

    if (nw === -1 || ne === -1 || sw === -1 || se === -1) return;

    nodeChildren[ci + 0] = nw;
    nodeChildren[ci + 1] = ne;
    nodeChildren[ci + 2] = sw;
    nodeChildren[ci + 3] = se;

    // Re-insert existing body
    const oldIdx = nodeBody[nid];
    if (oldIdx >= 0) {
        nodeBody[nid] = -1;
        const q = getQuadrant(nid, x[oldIdx], y[oldIdx]);
        insertBody(nodeChildren[ci + q], oldIdx);
    }
}

function insertBody(nid, idx) {
    if (nid === -1) return;

    if (nodeCount[nid] === 0) {
        nodeBody[nid] = idx;
        nodeMass[nid] = mass[idx];
        nodeComX[nid] = x[idx];
        nodeComY[nid] = y[idx];
        nodeCount[nid] = 1;
        return;
    }

    const ci = nid * 4;
    if (nodeChildren[ci] === -1) {
        subdivide(nid);
    }

    if (nodeChildren[ci] !== -1) {
        const q = getQuadrant(nid, x[idx], y[idx]);
        insertBody(nodeChildren[ci + q], idx);
    }

    const totalM = nodeMass[nid] + mass[idx];
    nodeComX[nid] = (nodeComX[nid] * nodeMass[nid] + x[idx] * mass[idx]) / totalM;
    nodeComY[nid] = (nodeComY[nid] * nodeMass[nid] + y[idx] * mass[idx]) / totalM;
    nodeMass[nid] = totalM;
    nodeCount[nid]++;
}

function buildTree() {
    nodePoolSize = 0;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let i = 0; i < N; i++) {
        if (x[i] < minX) minX = x[i];
        if (x[i] > maxX) maxX = x[i];
        if (y[i] < minY) minY = y[i];
        if (y[i] > maxY) maxY = y[i];
    }
    const dx = maxX - minX, dy = maxY - minY;
    const half = Math.max(dx, dy) * 0.55 + 0.1;
    const cx = (minX + maxX) * 0.5, cy = (minY + maxY) * 0.5;

    const root = allocNode(cx, cy, half);
    for (let i = 0; i < N; i++) {
        insertBody(root, i);
    }
    return root;
}

// ─── Force from tree (iterative stack for deep trees) ──────────
const treeStack = new Int32Array(200);

// Fast inverse square root proxy
function fastInvSqrtR3(r2) {
    // For JS, simply using Math.sqrt but reordered is often fast enough.
    const rInv = 1.0 / Math.sqrt(r2);
    return rInv * rInv * rInv;
}

function computeForceFromTree(root, bx, by) {
    let fax = 0, fay = 0;
    let stackTop = 0;
    treeStack[stackTop++] = root;

    // Dynamically adjust THETA based on N for performance scaling
    // At N=100k, we want to be much more aggressive (e.g. THETA=1.2)
    const currentTheta = N > 10000 ? 1.2 : BH_THETA;
    const thetaSq = currentTheta * currentTheta;

    while (stackTop > 0) {
        const nid = treeStack[--stackTop];
        if (nodeCount[nid] === 0) continue;

        const dx = nodeComX[nid] - bx;
        const dy = nodeComY[nid] - by;
        // Avoid `Math.sqrt` if we can use squared distances everywhere
        const r2 = dx * dx + dy * dy + SOFTENING;

        if (nodeCount[nid] === 1) {
            if (r2 < SOFTENING * 2) continue;
            const r3Inv = fastInvSqrtR3(r2);
            fax += G * nodeMass[nid] * dx * r3Inv;
            fay += G * nodeMass[nid] * dy * r3Inv;
            continue;
        }

        const s = nodeHalf[nid] * 2;
        if (s * s < thetaSq * r2) {
            const r3Inv = fastInvSqrtR3(r2);
            fax += G * nodeMass[nid] * dx * r3Inv;
            fay += G * nodeMass[nid] * dy * r3Inv;
            continue;
        }

        const ci = nid * 4;
        for (let c = 0; c < 4; c++) {
            if (nodeChildren[ci + c] !== -1) {
                treeStack[stackTop++] = nodeChildren[ci + c];
            }
        }
    }
    return [fax, fay];
}

// ─── Force computation ──────────────────────────────────────────
function computeForcesDirect() {
    for (let i = 0; i < N; i++) { ax[i] = 0; ay[i] = 0; }
    for (let i = 0; i < N; i++) {
        let axi = 0, ayi = 0;
        for (let j = i + 1; j < N; j++) {
            const dx = x[j] - x[i];
            const dy = y[j] - y[i];
            const r2 = dx * dx + dy * dy + SOFTENING;
            const r3Inv = fastInvSqrtR3(r2);
            const fx = G * dx * r3Inv;
            const fy = G * dy * r3Inv;
            axi += mass[j] * fx;
            ayi += mass[j] * fy;
            ax[j] -= mass[i] * fx;
            ay[j] -= mass[i] * fy;
        }
        ax[i] += axi;
        ay[i] += ayi;
    }
}

function computeForcesBarnesHut() {
    const root = buildTree();
    for (let i = 0; i < N; i++) {
        const [fax, fay] = computeForceFromTree(root, x[i], y[i]);
        ax[i] = fax;
        ay[i] = fay;
    }
}

function computeForces() {
    if (N > BH_THRESHOLD) {
        computeForcesBarnesHut();
    } else {
        computeForcesDirect();
    }
}

// ─── Leapfrog integrator ────────────────────────────────────────
function leapfrogStep(dt) {
    const hdt = 0.5 * dt;
    for (let i = 0; i < N; i++) { vx[i] += hdt * ax[i]; vy[i] += hdt * ay[i]; }
    for (let i = 0; i < N; i++) { x[i] += dt * vx[i]; y[i] += dt * vy[i]; }
    computeForces();
    for (let i = 0; i < N; i++) { vx[i] += hdt * ax[i]; vy[i] += hdt * ay[i]; }
}

// ─── Energy computation ─────────────────────────────────────────
function computeEnergy() {
    let ke = 0, pe = 0;
    for (let i = 0; i < N; i++) {
        ke += 0.5 * mass[i] * (vx[i] * vx[i] + vy[i] * vy[i]);
    }
    // Skip O(N²) PE for large N — too expensive
    if (N > 500) return ke;
    for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
            const dx = x[j] - x[i];
            const dy = y[j] - y[i];
            const r = Math.sqrt(dx * dx + dy * dy + SOFTENING);
            pe -= G * mass[i] * mass[j] / r;
        }
    }
    return ke + pe;
}

// ─── Message handler ────────────────────────────────────────────
self.onmessage = function (e) {
    const msg = e.data;

    switch (msg.type) {
        case 'init': {
            N = msg.n;
            x = new Float64Array(msg.x);
            y = new Float64Array(msg.y);
            vx = new Float64Array(msg.vx);
            vy = new Float64Array(msg.vy);
            ax = new Float64Array(N);
            ay = new Float64Array(N);
            mass = new Float64Array(msg.mass);
            simTime = 0;
            computeForces();
            const energy = computeEnergy();
            // Send back initial positions + energy
            const posOut = new Float64Array(N * 2);
            for (let i = 0; i < N; i++) { posOut[i * 2] = x[i]; posOut[i * 2 + 1] = y[i]; }
            self.postMessage({
                type: 'positions',
                data: posOut.buffer,
                n: N,
                energy: energy,
                simTime: simTime
            }, [posOut.buffer]);
            break;
        }
        case 'step': {
            const dt = msg.dt;
            const substeps = msg.substeps || 1;
            for (let s = 0; s < substeps; s++) {
                leapfrogStep(dt);
                simTime += dt;
            }
            const energy = computeEnergy();
            // Send positions back as transferable buffer
            const posOut = new Float64Array(N * 2);
            for (let i = 0; i < N; i++) { posOut[i * 2] = x[i]; posOut[i * 2 + 1] = y[i]; }
            self.postMessage({
                type: 'positions',
                data: posOut.buffer,
                n: N,
                energy: energy,
                simTime: simTime
            }, [posOut.buffer]);
            break;
        }
        case 'addBody': {
            // Expand arrays
            const newN = N + 1;
            const nx = new Float64Array(newN); nx.set(x); nx[N] = msg.x;
            const ny = new Float64Array(newN); ny.set(y); ny[N] = msg.y;
            const nvx = new Float64Array(newN); nvx.set(vx); nvx[N] = msg.vx;
            const nvy = new Float64Array(newN); nvy.set(vy); nvy[N] = msg.vy;
            const nax = new Float64Array(newN); nax.set(ax);
            const nay = new Float64Array(newN); nay.set(ay);
            const nm = new Float64Array(newN); nm.set(mass); nm[N] = msg.mass;
            x = nx; y = ny; vx = nvx; vy = nvy; ax = nax; ay = nay; mass = nm;
            N = newN;
            computeForces();
            const energy = computeEnergy();
            self.postMessage({ type: 'bodyAdded', n: N, energy: energy });
            break;
        }
        case 'clear': {
            N = 0;
            x = y = vx = vy = ax = ay = mass = null;
            simTime = 0;
            self.postMessage({ type: 'cleared' });
            break;
        }
    }
};
