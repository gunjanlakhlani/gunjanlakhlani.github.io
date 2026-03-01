---
layout: post
title: "Building a Gravitational N-Body Solver from Scratch"
date: 2026-02-28
excerpt: "How to simulate the dance of stars and planets — from Newton's law to a working C implementation with symplectic integration, energy conservation, and the beautiful figure-8 three-body orbit."
tags: [physics, simulation, computational-physics, N-body]
---

There's something deeply satisfying about watching gravity do its thing. Two stars locked in an eternal waltz. Three bodies tracing an impossible figure-8. A cluster of a thousand particles collapsing under their own weight.

In this post, I'll walk through how I built a gravitational N-body solver in C — from the physics, to the algorithm, to the code — and show you the results. If you want to play with gravity yourself, there's an **[interactive simulator](/nbody-simulator/)** at the end.

## The N-Body Problem

The setup is deceptively simple. You have $N$ masses, each feeling the gravitational pull of every other mass. Newton tells us the force on body $i$ from body $j$ is:

$$\vec{F}_{ij} = -\frac{G m_i m_j}{|\vec{r}_{ij}|^3}\vec{r}_{ij}$$

where $\vec{r}_{ij} = \vec{r}_i - \vec{r}_j$ is the separation vector. The total force on body $i$ is the sum over all other bodies:

$$\vec{F}_i = \sum_{j \neq i} \vec{F}_{ij}$$

For $N = 2$, this has a beautiful closed-form solution — Kepler's ellipses. For $N = 3$, it's [famously chaotic](https://en.wikipedia.org/wiki/Three-body_problem). For $N > 3$, we have no choice but to simulate.

## Softened Gravity

There's a practical problem: when two bodies get very close, $|\vec{r}_{ij}| \to 0$ and the force diverges. In a simulation with discrete timesteps, this causes numerical explosions. The standard fix is **gravitational softening** — we add a small $\varepsilon^2$ to the denominator:

$$\vec{a}_i = \sum_{j \neq i} \frac{G m_j (\vec{r}_j - \vec{r}_i)}{(|\vec{r}_{ij}|^2 + \varepsilon^2)^{3/2}}$$

This caps the maximum force at close range while leaving long-range forces unchanged. Think of it as giving each point mass a small, finite size — much like real stars aren't actually point particles.

## The Integrator: Why Leapfrog?

This is where most N-body tutorials gloss over the crucial detail. You might think: "I'll just use Euler's method." Don't.

**Euler's method** ($x_{n+1} = x_n + v_n \Delta t$, $v_{n+1} = v_n + a_n \Delta t$) is first-order and, worse, it systematically **gains energy** over time. Your orbits will spiral outward. This is a disaster for gravitational dynamics.

The right choice is a **symplectic integrator** — one that exactly preserves the geometric structure of Hamiltonian mechanics. The simplest and most widely used is the **Leapfrog** method (also called Velocity Verlet), which uses a Kick-Drift-Kick scheme:

$$
\vec{v}_{i}^{n+1/2} = \vec{v}_i^n + \frac{\Delta t}{2}\vec{a}_i^n \quad \text{(half kick)}
$$

$$
\vec{x}_i^{n+1} = \vec{x}_i^n + \Delta t \, \vec{v}_i^{n+1/2} \quad \text{(drift)}
$$

$$
\vec{a}_i^{n+1} = \text{compute\_forces}(\vec{x}^{n+1}) \quad \text{(new forces)}
$$

$$
\vec{v}_i^{n+1} = \vec{v}_i^{n+1/2} + \frac{\Delta t}{2}\vec{a}_i^{n+1} \quad \text{(half kick)}
$$

This is second-order accurate (error $\sim \Delta t^2$), requires only **one force evaluation per step**, and — crucially — conserves energy to machine precision over arbitrary timescales. The orbits stay orbits.

## The Code

I chose C for raw speed — the force computation is the bottleneck, and we need every cycle we can get. Here's the core force loop:

```c
for (int i = 0; i < n; i++) {
    double axi = 0.0, ayi = 0.0, azi = 0.0;
    for (int j = i + 1; j < n; j++) {
        double dx = x[j] - x[i];
        double dy = y[j] - y[i];
        double dz = z[j] - z[i];

        double r2    = dx*dx + dy*dy + dz*dz + SOFTENING;
        double r_inv = 1.0 / sqrt(r2);
        double r3_inv = r_inv * r_inv * r_inv;

        double fx = G * dx * r3_inv;
        double fy = G * dy * r3_inv;
        double fz = G * dz * r3_inv;

        // Newton's third law: compute once, apply twice
        axi   += mass[j] * fx;   ayi   += mass[j] * fy;   azi   += mass[j] * fz;
        ax[j] -= mass[i] * fx;   ay[j] -= mass[i] * fy;   az[j] -= mass[i] * fz;
    }
    ax[i] += axi;  ay[i] += ayi;  az[i] += azi;
}
```

A few things to note:

- **Newton's third law** cuts the work in half — we only compute each pair once (the inner loop starts at $j = i+1$)
- **Structure-of-Arrays** layout (`x[]`, `y[]`, `z[]` as separate arrays rather than an array of structs) is critical for cache performance and SIMD vectorization
- With `-O3 -march=native -ffast-math`, GCC auto-vectorizes the inner loop

The Leapfrog step is equally clean:

```c
static void leapfrog_step(NBodySystem *sys, double dt) {
    double half_dt = 0.5 * dt;

    // Half kick
    for (int i = 0; i < n; i++) {
        sys->vx[i] += half_dt * sys->ax[i];
        sys->vy[i] += half_dt * sys->ay[i];
        sys->vz[i] += half_dt * sys->az[i];
    }
    // Full drift
    for (int i = 0; i < n; i++) {
        sys->x[i] += dt * sys->vx[i];
        sys->y[i] += dt * sys->vy[i];
        sys->z[i] += dt * sys->vz[i];
    }
    // New forces + second half kick
    compute_forces(sys);
    for (int i = 0; i < n; i++) {
        sys->vx[i] += half_dt * sys->ax[i];
        sys->vy[i] += half_dt * sys->ay[i];
        sys->vz[i] += half_dt * sys->az[i];
    }
}
```

## Testing: Does It Conserve Energy?

The litmus test for any gravitational integrator is energy conservation. The total energy $E = K + U$ (kinetic plus potential) should be constant for an isolated system.

### Two-Body Kepler Orbit

Two equal-mass bodies in a circular orbit — the simplest possible test. After 100,000 steps:

| Metric | Value |
|--------|-------|
| Initial energy | $-7.4995 \times 10^{-1}$ |
| Final energy | $-7.4995 \times 10^{-1}$ |
| Relative error $\lvert\Delta E / E_0\rvert$ | $6.85 \times 10^{-8}$ |
| Performance | 18.4 million steps/sec |

That's 8 digits of energy conservation — **excellent** for a second-order integrator. The orbits close perfectly.

### Three-Body Figure-8

This is one of the most remarkable discoveries in celestial mechanics. In 2000, Chenciner and Montgomery proved the existence of a periodic solution where three equal-mass bodies chase each other along a **figure-8 shaped path**. The initial conditions are known to high precision:

| Body | $x$ | $y$ | $v_x$ | $v_y$ |
|------|-----|-----|--------|--------|
| 1 | $+0.97000$ | $-0.24309$ | $+0.46620$ | $+0.43237$ |
| 2 | $-0.97000$ | $+0.24309$ | $+0.46620$ | $+0.43237$ |
| 3 | $0$ | $0$ | $-0.93241$ | $-0.86473$ |

After 50,000 steps:

| Metric | Value |
|--------|-------|
| Relative error $\lvert\Delta E / E_0\rvert$ | $7.65 \times 10^{-8}$ |
| Period | $T \approx 6.326$ |

Again, excellent energy conservation. The three bodies trace the figure-8 path repeatedly with no visible drift.

## Complexity and Scaling

The direct pairwise algorithm is $O(N^2)$ per timestep — every body interacts with every other body. This is fine for $N \leq 10{,}000$ (we hit ~18 million steps/sec for $N=2$, and the force computation scales as $N(N-1)/2$ pairs).

For much larger $N$, the standard optimization is the **Barnes-Hut algorithm**, which builds an octree and approximates the force from distant groups of particles as a single multipole. This reduces the complexity to $O(N \log N)$ — essential for galaxy-scale simulations with millions of bodies.

## Try It Yourself

I built an **[interactive gravitational simulator](/nbody-simulator/)** that runs the same algorithm in your browser. You can:

- Load presets (two-body orbit, three-body figure-8, random clusters)
- **Click to place bodies** and drag to set their velocity
- Watch the energy conservation in real-time
- Adjust the timestep and see what happens when you make it too large (hint: orbits explode)

The full C source code is available on [GitHub](https://github.com/gunjanlakhlani).

---

*The N-body problem sits at the intersection of physics, mathematics, and computation — a place I've always loved being. If you enjoyed this, try placing three bodies randomly in the simulator. Chaos is beautiful.*
