---
layout: post
title: "Building a Gravitational N-Body Solver from Scratch"
date: 2026-02-28
excerpt: "From Newton's law of gravitation to a working C implementation — symplectic integration, energy conservation, and the beautiful figure-8 three-body orbit."
tags: [physics, simulation, computational-physics, N-body]
---

There's something deeply satisfying about watching gravity do its thing. Two stars locked in an eternal waltz. Three bodies tracing an impossible figure-8. A cluster of a thousand particles collapsing under their own weight.

In this post, I'll walk through how I built a gravitational N-body solver in C — from the physics, to the algorithm, to the code — and show you the results. If you want to play with gravity yourself, there's an **[interactive simulator](/nbody-simulator/)** at the end.

---

## 1 &nbsp; The N-Body Problem

The setup is deceptively simple. You have $N$ point masses, each feeling the gravitational pull of every other mass.

Newton tells us the force on body $i$ due to body $j$:

$$\mathbf{F}_{ij} = -\frac{G\, m_i\, m_j}{\lvert \mathbf{r}_{ij} \rvert^{3}} \, \mathbf{r}_{ij}$$

where $\mathbf{r}_{ij} = \mathbf{r}_{i} - \mathbf{r}_{j}$ is the separation vector pointing from $j$ to $i$, and $G$ is Newton's gravitational constant. The total force on body $i$ is the sum over all other bodies:

$$\mathbf{F}_{i} = \sum_{j \neq i} \mathbf{F}_{ij}$$

For $N = 2$, we get Kepler's beautiful closed-form ellipses. For $N = 3$, the system is [famously chaotic](https://en.wikipedia.org/wiki/Three-body_problem) — Poincaré proved in 1890 that no general closed-form solution exists. For $N > 3$, we have no choice but to simulate.

---

## 2 &nbsp; Softened Gravity

There's a practical problem with the force law above. When two bodies get very close, the denominator $\lvert \mathbf{r}_{ij} \rvert^3 \to 0$ and the force *diverges*. In a simulation with discrete timesteps, this creates catastrophic numerical explosions — a single close encounter can send particles flying off to infinity.

The standard fix is **gravitational softening**. We add a small parameter $\varepsilon^2$ to the denominator:

$$\mathbf{a}_{i} = \sum_{j \neq i} \frac{G\, m_j \, (\mathbf{r}_j - \mathbf{r}_i)}{\bigl(\lvert \mathbf{r}_{ij} \rvert^{2} + \varepsilon^{2}\bigr)^{3/2}}$$

Physically, this is equivalent to smearing each point mass into a small sphere of radius $\sim \varepsilon$. At distances $r \gg \varepsilon$, the softened force is indistinguishable from the real thing. At very close range, the force caps at a finite maximum instead of diverging. In my implementation, I use $\varepsilon^2 = 10^{-4}$.

> **Why acceleration, not force?** Once you divide by $m_i$ (Newton's second law), the mass of the test body cancels. It's cleaner to work directly in terms of accelerations — this is what the code computes.

---

## 3 &nbsp; The Integrator: Why Leapfrog?

This is the part that most N-body tutorials gloss over — and it's arguably the most important design decision in the entire project.

### Why Not Euler?

Your first instinct might be: just use Euler's method:

$$x_{n+1} = x_n + v_n \, \Delta t, \qquad v_{n+1} = v_n + a_n \, \Delta t$$

This is first-order and, worse, it **systematically gains energy** over time. Your orbits will spiral outward. Run it long enough and every bound system flies apart. This is a fundamental failure mode — Euler's method doesn't understand that energy should be conserved.

### The Symplectic Advantage

The right choice is a **symplectic integrator** — one that exactly preserves the *geometric structure* of Hamiltonian mechanics. Here's the key insight: gravity is a Hamiltonian system, meaning it lives on a phase space with a special structure (a symplectic form). A symplectic integrator preserves this structure exactly, which means it can never systematically gain or lose energy. The errors it makes are *bounded* forever.

The simplest and most widely used symplectic integrator is the **Leapfrog** method (also called Velocity Verlet). It uses a Kick-Drift-Kick scheme:

$$\mathbf{v}_{i}^{\,n+1/2} = \mathbf{v}_{i}^{\,n} + \frac{\Delta t}{2}\,\mathbf{a}_{i}^{\,n} \qquad \text{(half kick)}$$

$$\mathbf{x}_{i}^{\,n+1} = \mathbf{x}_{i}^{\,n} + \Delta t\;\mathbf{v}_{i}^{\,n+1/2} \qquad \text{(drift)}$$

$$\mathbf{a}_{i}^{\,n+1} = \texttt{compute\_forces}\!\bigl(\mathbf{x}^{\,n+1}\bigr) \qquad \text{(new forces)}$$

$$\mathbf{v}_{i}^{\,n+1} = \mathbf{v}_{i}^{\,n+1/2} + \frac{\Delta t}{2}\,\mathbf{a}_{i}^{\,n+1} \qquad \text{(half kick)}$$

Notice the beautiful symmetry: the velocity is updated in two *half*-steps that straddle the position update. This time-reversibility is what makes it symplectic.

**Properties of Leapfrog:**
- Second-order accurate (global error $\sim \Delta t^2$)
- Requires only **one force evaluation per step**
- *Exactly* symplectic — energy errors are bounded, never growing
- Time-reversible — run the simulation backwards and you recover the initial state

The orbits stay orbits. Forever.

---

## 4 &nbsp; The Code

I chose C for raw speed — the $O(N^2)$ force computation is the bottleneck of the entire simulation, and we need every CPU cycle we can get.

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

- **Newton's third law** cuts the work in half — we only compute each pair once (the inner loop starts at $j = i+1$), exploiting  $\mathbf{F}_{ij} = -\mathbf{F}_{ji}$
- **Structure-of-Arrays** (SoA) layout: position components are stored as separate arrays `x[]`, `y[]`, `z[]` rather than an array of structs. This dramatically improves cache locality and enables SIMD auto-vectorization
- With `-O3 -march=native -ffast-math`, GCC auto-vectorizes the inner loop using AVX2 instructions

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
| Initial energy $E_0$ | $-7.4995 \times 10^{-1}$ |
| Final energy $E_f$ | $-7.4995 \times 10^{-1}$ |
| Relative error $\lvert \Delta E / E_0 \rvert$ | $6.85 \times 10^{-8}$ |
| Throughput | 18.4 million steps/sec |

That's **eight digits** of energy conservation. The orbits close perfectly on every revolution with no visible drift.

### Three-Body Figure-8

This is one of the most remarkable discoveries in celestial mechanics. In 2000, Alain Chenciner and Richard Montgomery [proved the existence](https://arxiv.org/abs/math/0011268) of a periodic solution where three equal-mass bodies chase each other along a **figure-8 shaped path** in the plane. It's a choreography — all three bodies trace the *same* curve, offset in time by one-third of a period.

The initial conditions are known to high precision:

| Body | $x$ | $y$ | $v_x$ | $v_y$ |
|------|-------|-------|----------|----------|
| 1 | $+0.97000$ | $-0.24309$ | $+0.46620$ | $+0.43237$ |
| 2 | $-0.97000$ | $+0.24309$ | $+0.46620$ | $+0.43237$ |
| 3 | $\phantom{+}0.00000$ | $\phantom{+}0.00000$ | $-0.93241$ | $-0.86473$ |

After 50,000 steps:

| Metric | Value |
|--------|-------|
| Relative error $\lvert \Delta E / E_0 \rvert$ | $7.65 \times 10^{-8}$ |
| Period | $T \approx 6.326$ |

Again, excellent energy conservation. The three bodies trace the figure-8 path repeatedly with no visible drift. The choreography is stable under our Leapfrog integrator — a strong confirmation that the symplectic property is doing its job.

---

## 6 &nbsp; Complexity and Scaling

The direct pairwise algorithm computes all $N(N-1)/2$ pairs at each timestep, giving $O(N^2)$ time complexity. For small $N$ (up to ~10,000), this is perfectly tractable — we measured ~18 million pair-evaluations per second on a single core.

For larger simulations ($N > 10^5$), the standard approach is the **Barnes-Hut algorithm** (1986). The idea is elegant: you build an octree over the particle positions and then approximate the gravitational effect of distant groups of particles as a single multipole expansion. Close particles are still computed exactly. This reduces the cost from $O(N^2)$ to $O(N \log N)$, making million-body simulations feasible.

---

## 7 &nbsp; Try It Yourself

I built an **[interactive gravitational simulator](/nbody-simulator/)** that runs the same physics in your browser using HTML5 Canvas. You can:

- Choose from **6 presets** — two-body orbit, three-body figure-8, Plummer cluster, solar system, binary star, and Lagrange triangle
- **Click anywhere** to place new bodies, then **drag** to set their initial velocity
- Watch the **energy diagnostics** in real-time — the colour tells you how well energy is being conserved
- Crank up the timestep and watch what happens when $\Delta t$ gets too large (hint: the orbits explode — this is exactly why the choice of integrator matters)

**[Launch the simulator →](/nbody-simulator/)**

The full C source code for the solver is available on [GitHub](https://github.com/gunjanlakhlani).

---

*The N-body problem sits at the intersection of physics, mathematics, and computation — a place I've always loved being. If you enjoyed this, try placing three bodies randomly in the simulator and watch the chaos unfold. It's beautiful.*
