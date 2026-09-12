---
layout: post
title: "Building a Gravitational N-Body Solver from Scratch"
date: 2026-02-28
excerpt: "From Newton's law of gravitation to a working C implementation — symplectic integration, energy conservation, and the beautiful figure-8 three-body orbit."
tags: [physics, simulation, computational-physics, N-body]
math: true
simulator: true
---

There's something deeply satisfying about watching gravity do its thing. Two stars locked in an eternal waltz. Three bodies tracing an impossible figure-8. A cluster of a thousand particles collapsing under their own weight.

In this post, I'll walk through the solver from the physics to the browser architecture: a symplectic integrator, a Barnes–Hut tree, a Web Worker, and a WebGL renderer. If you want to play with gravity first, open the **[interactive simulator](/nbody-simulator-webgl-worker/)**.

---

## 1 &nbsp; The N-Body Problem

The setup is deceptively simple. You have \(N\) point masses, each feeling the gravitational pull of every other mass.

Newton tells us the force on body \(i\) due to body \(j\):

$$\mathbf{F}_{ij} = -\frac{G\, m_i\, m_j}{\lvert \mathbf{r}_{ij} \rvert^{3}} \, \mathbf{r}_{ij}$$

where \(\mathbf{r}_{ij} = \mathbf{r}_{i} - \mathbf{r}_{j}\) is the separation vector pointing from \(j\) to \(i\), and \(G\) is Newton's gravitational constant. The total force on body \(i\) is the sum over all other bodies:

$$\mathbf{F}_{i} = \sum_{j \neq i} \mathbf{F}_{ij}$$

For \(N = 2\), we get Kepler's beautiful closed-form conic sections. Starting at \(N = 3\), generic trajectories can be chaotic and there is no comparable general formula for arbitrary initial conditions. Numerical integration is the practical route.

---

## 2 &nbsp; Softened Gravity

There's a practical problem with the force law above. When two bodies get very close, the denominator \(\lvert \mathbf{r}_{ij} \rvert^3 \to 0\) and the force *diverges*. In a simulation with discrete timesteps, this creates catastrophic numerical explosions — a single close encounter can send particles flying off to infinity.

The standard fix is **gravitational softening**. We add a small parameter \(\varepsilon^2\) to the denominator:

$$\mathbf{a}_{i} = \sum_{j \neq i} \frac{G\, m_j \, (\mathbf{r}_j - \mathbf{r}_i)}{\bigl(\lvert \mathbf{r}_{ij} \rvert^{2} + \varepsilon^{2}\bigr)^{3/2}}$$

This Plummer-style softening can be interpreted as replacing a point source with an extended mass profile. At distances \(r \gg \varepsilon\), the force approaches the point-mass result. At close range, it remains finite. In this dimensionless simulation, I use \(\varepsilon^2 = 10^{-4}\).

> **Why acceleration, not force?** Once you divide by \(m_i\) (Newton's second law), the mass of the test body cancels. It's cleaner to work directly in terms of accelerations — this is what the code computes.

---

## 3 &nbsp; The Integrator: Why Leapfrog?

This is the part that most N-body tutorials gloss over — and it's arguably the most important design decision in the entire project.

### Why Not Euler?

Your first instinct might be: just use Euler's method:

$$x_{n+1} = x_n + v_n \, \Delta t, \qquad v_{n+1} = v_n + a_n \, \Delta t$$

This is first-order and, worse, it **systematically gains energy** over time. Your orbits will spiral outward. Run it long enough and every bound system flies apart. This is a fundamental failure mode — Euler's method doesn't understand that energy should be conserved.

### The Symplectic Advantage

The right choice is a **symplectic integrator**—one designed to preserve the geometric structure of Hamiltonian mechanics. With a fixed timestep and a well-resolved trajectory, its energy error typically oscillates around the true value instead of drifting monotonically. That is a powerful long-term advantage, but not magic: a timestep that is too large can still produce a bad orbit.

The simplest and most widely used symplectic integrator is the **Leapfrog** method (also called Velocity Verlet). It uses a Kick-Drift-Kick scheme:

$$\mathbf{v}_{i}^{\,n+1/2} = \mathbf{v}_{i}^{\,n} + \frac{\Delta t}{2}\,\mathbf{a}_{i}^{\,n} \qquad \text{(half kick)}$$

$$\mathbf{x}_{i}^{\,n+1} = \mathbf{x}_{i}^{\,n} + \Delta t\;\mathbf{v}_{i}^{\,n+1/2} \qquad \text{(drift)}$$

$$\mathbf{a}_{i}^{\,n+1} = \texttt{compute\_forces}\!\bigl(\mathbf{x}^{\,n+1}\bigr) \qquad \text{(new forces)}$$

$$\mathbf{v}_{i}^{\,n+1} = \mathbf{v}_{i}^{\,n+1/2} + \frac{\Delta t}{2}\,\mathbf{a}_{i}^{\,n+1} \qquad \text{(half kick)}$$

Notice the beautiful symmetry: the velocity is updated in two *half*-steps that straddle the position update. This time-reversibility is what makes it symplectic.

**Properties of Leapfrog:**
- Second-order accurate (global error \(\sim \Delta t^2\))
- Requires only **one force evaluation per step**
- Symplectic at a fixed timestep — long-term energy error is usually bounded and oscillatory
- Time-reversible — run the simulation backwards and you recover the initial state

The practical result is that resolved orbits remain recognisably orbital over long runs.

---

## 4 &nbsp; The Code

The reference implementation is written in C, while the live version runs JavaScript in a Web Worker so it can work on GitHub Pages without a server. Both use structure-of-arrays storage; the browser version switches algorithms as the system grows.

### Force Computation

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
        axi   += mass[j] * fx;
        ayi   += mass[j] * fy;
        azi   += mass[j] * fz;
        ax[j] -= mass[i] * fx;
        ay[j] -= mass[i] * fy;
        az[j] -= mass[i] * fz;
    }
    ax[i] += axi;  ay[i] += ayi;  az[i] += azi;
}
```

A few things to note:

- **Newton's third law** cuts the work in half — we only compute each pair once (the inner loop starts at \(j = i+1\)), exploiting \(\mathbf{F}_{ij} = -\mathbf{F}_{ji}\)
- **Structure-of-Arrays** (SoA) layout: position components are stored as separate arrays `x[]`, `y[]`, `z[]` rather than an array of structs. This dramatically improves cache locality and enables SIMD auto-vectorization
- With an optimising compiler, the simple contiguous loops are good candidates for auto-vectorisation. The exact instructions depend on the compiler, flags, and target CPU, so this is something to verify from the generated code rather than assume.

### The Leapfrog Step

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

Clean, readable, and fast. Each loop is a single SIMD-friendly pass over contiguous memory.

---

## 5 &nbsp; Testing: Does It Conserve Energy?

The litmus test for any gravitational integrator is energy conservation. For an isolated system, the total energy

$$E = K + U = \sum_i \frac{1}{2} m_i \lvert \mathbf{v}_i \rvert^2 - \sum_{i < j} \frac{G\, m_i\, m_j}{\lvert \mathbf{r}_{ij} \rvert}$$

should remain constant over time. Any systematic drift means the integrator is unphysical.

### Two-Body Kepler Orbit

The simplest possible test: two equal-mass bodies in a circular orbit. After 100,000 timesteps:

| Metric | Value |
|--------|-------|
| Initial energy \(E_0\) | \(-7.4995 \times 10^{-1}\) |
| Final energy \(E_f\) | \(-7.4995 \times 10^{-1}\) |
| Relative error \(\lvert \Delta E / E_0 \rvert\) | \(6.85 \times 10^{-8}\) |
| Throughput | 18.4 million steps/sec |

That run kept the relative energy error below one part in ten million. It is a useful regression test for this particular timestep and initial condition—not a universal accuracy guarantee.

### Three-Body Figure-8

This is one of the most remarkable modern results in celestial mechanics. Cris Moore found the orbit numerically in 1993; Alain Chenciner and Richard Montgomery later [proved the existence](https://arxiv.org/abs/math/0011268) of the equal-mass periodic solution. The bodies form a choreography: all three trace the same figure-eight curve, separated by one-third of a period.

The initial conditions are known to high precision:

| Body | \(x\) | \(y\) | \(v_x\) | \(v_y\) |
|------|-------|-------|----------|----------|
| 1 | \(+0.97000\) | \(-0.24309\) | \(+0.46620\) | \(+0.43237\) |
| 2 | \(-0.97000\) | \(+0.24309\) | \(+0.46620\) | \(+0.43237\) |
| 3 | \(0.00000\) | \(0.00000\) | \(-0.93241\) | \(-0.86473\) |

After 50,000 steps:

| Metric | Value |
|--------|-------|
| Relative error \(\lvert \Delta E / E_0 \rvert\) | \(7.65 \times 10^{-8}\) |
| Period | \(T \approx 6.326\) |

Again, the small error is encouraging. More precisely, it shows that this implementation and timestep reproduce the known choreography for the measured duration. It does not mean the orbit is stable to every perturbation.

---

## 6 &nbsp; Complexity and Scaling

The direct pairwise algorithm computes all \(N(N-1)/2\) pairs at each timestep, giving \(O(N^2)\) time complexity. It is exact with respect to the softened force law and works well for small systems, but its cost rises quickly.

The live solver switches to the **Barnes–Hut algorithm** above 200 bodies. It builds a quadtree over the two-dimensional positions and approximates sufficiently distant cells by their centre of mass. Nearby cells are opened and examined in more detail. The opening angle \(\theta\) trades accuracy for speed; the implementation uses a stricter value for ordinary runs and relaxes it for the largest presets. Typical cost falls toward \(O(N\log N)\), though pathological particle distributions can do worse.

## 7 &nbsp; Browser Architecture

The browser version separates simulation from presentation:

1. A **Web Worker** owns positions, velocities, masses, force calculation, and leapfrog steps. Heavy computation never blocks pointer input or the page controls.
2. Each completed frame transfers a packed position buffer back to the main thread without copying it twice.
3. **WebGL** draws the particles in one batched call. A small 2D overlay handles trails, the grid, and interaction feedback.
4. Direct summation is used for small systems; Barnes–Hut takes over when the body count makes pairwise work expensive.

For systems above 500 bodies, the interface intentionally stops reporting total energy. Computing exact potential energy is itself \(O(N^2)\); showing kinetic energy under a “total energy” label would be fast but physically misleading.

---

## 8 &nbsp; Try It Yourself

I built an **[interactive gravitational simulator](/nbody-simulator-webgl-worker/)** that runs the physics in your browser using a worker and WebGL. You can:

- Choose from classic two- and three-body systems or scale up to large particle fields
- **Click anywhere** to place new bodies, then **drag** to set their initial velocity
- Watch the **energy diagnostics** in real-time — the colour tells you how well energy is being conserved
- Crank up the timestep and watch what happens when \(\Delta t\) gets too large (hint: the orbits explode — this is exactly why the choice of integrator matters)

**[Launch the simulator →](/nbody-simulator-webgl-worker/)**

The full C source code for the solver is available on [GitHub](https://github.com/gunjanlakhlani).

---

*The N-body problem sits at the intersection of physics, mathematics, and computation — a place I've always loved being. If you enjoyed this, try placing three bodies randomly in the simulator and watch the chaos unfold. It's beautiful.*
