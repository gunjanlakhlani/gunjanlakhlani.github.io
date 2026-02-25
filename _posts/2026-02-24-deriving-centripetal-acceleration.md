---
layout: post
title: "Why Does a Ball on a String Pull Your Hand? Deriving Centripetal Acceleration"
date: 2026-02-24
excerpt: "Spin a ball on a string and you feel a tug. But why? Let's derive the formula for centripetal acceleration from first principles — no calculus required."
tags: [physics, high-school, mechanics, derivation]
---

Have you ever spun a ball on a string in a circle above your head? You feel it pulling on your hand — constantly tugging *inward*. The ball wants to fly off in a straight line, but the string keeps yanking it back toward the centre.

That inward pull is the centripetal force. And it exists because the ball is **accelerating** — even if its *speed* never changes.

How can something accelerate without speeding up? That's what we're going to figure out today, and we'll end up with one of the most elegant little formulas in all of physics.

---

## Step 1: Acceleration Isn't Just About Speed

Most people think acceleration means "going faster". But in physics, **acceleration is any change in velocity** — and velocity includes *direction*.

If you're driving at 60 km/h around a corner, your speed is constant. But your direction is changing every moment. That means your *velocity* is changing. And if velocity changes, there must be an acceleration.

That's exactly what's happening with our ball on a string. Its speed stays the same, but it's constantly being redirected. That redirection *is* the acceleration.

---

## Step 2: Set Up the Picture

Let's put the ball on a circular path of radius $r$, moving at constant speed $v$.

<div style="text-align: center; margin: 2.5rem 0;">
<svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
  <rect width="320" height="320" fill="none"/>
  <circle cx="160" cy="160" r="110" fill="none" stroke="#4a5568" stroke-width="1.5" stroke-dasharray="6,4"/>
  <circle cx="160" cy="160" r="4" fill="#718096"/>
  <text x="168" y="165" fill="#718096" font-size="13" font-family="monospace">O (centre)</text>
  <line x1="160" y1="160" x2="160" y2="50" stroke="#718096" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="166" y="108" fill="#718096" font-size="13" font-family="monospace">r</text>
  <circle cx="160" cy="50" r="10" fill="#63b3ed" stroke="#4299e1" stroke-width="2"/>
  <line x1="160" y1="50" x2="240" y2="50" stroke="#68d391" stroke-width="2.5" marker-end="url(#ag1)"/>
  <text x="245" y="54" fill="#68d391" font-size="13" font-family="monospace" font-weight="bold">v</text>
  <circle cx="270" cy="160" r="10" fill="#63b3ed" stroke="#4299e1" stroke-width="2"/>
  <line x1="160" y1="160" x2="270" y2="160" stroke="#718096" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="270" y1="160" x2="270" y2="240" stroke="#68d391" stroke-width="2.5" marker-end="url(#ag1)"/>
  <text x="277" y="205" fill="#68d391" font-size="13" font-family="monospace" font-weight="bold">v</text>
  <line x1="160" y1="65" x2="160" y2="120" stroke="#fc8181" stroke-width="2.5" marker-end="url(#ar1)"/>
  <text x="100" y="98" fill="#fc8181" font-size="12" font-family="monospace">acceleration</text>
  <line x1="253" y1="160" x2="198" y2="160" stroke="#fc8181" stroke-width="2.5" marker-end="url(#ar1)"/>
  <defs>
    <marker id="ag1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#68d391"/></marker>
    <marker id="ar1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#fc8181"/></marker>
  </defs>
</svg>
<p style="color: #718096; font-size: 0.85rem; margin-top: 0.5rem; font-family: monospace;">
  The velocity (green) is always tangent to the circle. The acceleration (red) always points inward.
</p>
</div>

Notice two things:
1. **The velocity vector is always perpendicular to the radius** — it points *along* the circle, not toward the centre.
2. **The acceleration always points toward the centre** — it's constantly pulling the ball inward.

---

## Step 3: Watch What Happens in a Short Time Interval

Imagine the ball is at position **A**, and a tiny moment later — call it $\Delta t$ — it's at position **B**.

<div style="text-align: center; margin: 2.5rem 0;">
<svg width="360" height="280" viewBox="0 0 360 280" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="ab2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#63b3ed"/></marker>
    <marker id="ap2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#d6bcfa"/></marker>
  </defs>
  <path d="M 80,200 A 140,140 0 0,1 240,80" fill="none" stroke="#4a5568" stroke-width="1.5" stroke-dasharray="6,4"/>
  <circle cx="240" cy="240" r="4" fill="#718096"/>
  <text x="248" y="245" fill="#718096" font-size="12" font-family="monospace">O</text>
  <line x1="240" y1="240" x2="80" y2="200" stroke="#718096" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="240" y1="240" x2="240" y2="80" stroke="#718096" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="148" y="232" fill="#718096" font-size="12" font-family="monospace">r</text>
  <text x="244" y="168" fill="#718096" font-size="12" font-family="monospace">r</text>
  <path d="M 240,200 A 40,40 0 0,0 210,226" fill="none" stroke="#f6ad55" stroke-width="1.5"/>
  <text x="196" y="215" fill="#f6ad55" font-size="12" font-family="monospace">Δθ</text>
  <circle cx="80" cy="200" r="9" fill="#63b3ed" stroke="#4299e1" stroke-width="2"/>
  <text x="58" y="195" fill="#90cdf4" font-size="13" font-family="monospace" font-weight="bold">A</text>
  <circle cx="240" cy="80" r="9" fill="#63b3ed" stroke="#4299e1" stroke-width="2"/>
  <text x="248" y="78" fill="#90cdf4" font-size="13" font-family="monospace" font-weight="bold">B</text>
  <path d="M 80,200 A 140,140 0 0,1 240,80" fill="none" stroke="#68d391" stroke-width="2.5"/>
  <text x="110" y="112" fill="#68d391" font-size="12" font-family="monospace">Δs = v·Δt</text>
  <line x1="80" y1="200" x2="120" y2="140" stroke="#d6bcfa" stroke-width="2" marker-end="url(#ap2)"/>
  <text x="125" y="138" fill="#d6bcfa" font-size="12" font-family="monospace">v₁</text>
  <line x1="240" y1="80" x2="170" y2="64" stroke="#d6bcfa" stroke-width="2" marker-end="url(#ap2)"/>
  <text x="154" y="58" fill="#d6bcfa" font-size="12" font-family="monospace">v₂</text>
</svg>
<p style="color: #718096; font-size: 0.85rem; margin-top: 0.5rem; font-family: monospace;">
  In time Δt, the ball moves from A to B. The arc length is Δs = v·Δt and the angle swept is Δθ.
</p>
</div>

In this short time $\Delta t$:
- The ball travels an arc of length $\Delta s = v \cdot \Delta t$
- The radius sweeps through a small angle $\Delta\theta$

Since arc length = radius × angle (the definition of radians):

$$\Delta s = r \cdot \Delta\theta$$

So we can solve for $\Delta\theta$:

$$\Delta\theta = \frac{\Delta s}{r} = \frac{v \cdot \Delta t}{r}$$

---

## Step 4: The Clever Bit — Look at the Velocity Vectors

Here is the key insight. When the *position* rotates by $\Delta\theta$, the *velocity vector* also rotates by exactly $\Delta\theta$ — because velocity is always perpendicular to the radius, so they rotate together.

<div style="text-align: center; margin: 2.5rem 0;">
<svg width="300" height="260" viewBox="0 0 300 260" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="av1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#d6bcfa"/></marker>
    <marker id="av2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#f6ad55"/></marker>
    <marker id="adv" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#fc8181"/></marker>
  </defs>
  <line x1="150" y1="140" x2="260" y2="140" stroke="#d6bcfa" stroke-width="2.5" marker-end="url(#av1)"/>
  <text x="262" y="144" fill="#d6bcfa" font-size="13" font-family="monospace">v₁</text>
  <line x1="150" y1="140" x2="230" y2="60" stroke="#f6ad55" stroke-width="2.5" marker-end="url(#av2)"/>
  <text x="233" y="56" fill="#f6ad55" font-size="13" font-family="monospace">v₂</text>
  <path d="M 220,140 A 70,70 0 0,0 193,95" fill="none" stroke="#718096" stroke-width="1.2" stroke-dasharray="4,3"/>
  <text x="220" y="118" fill="#718096" font-size="12" font-family="monospace">Δθ</text>
  <line x1="260" y1="140" x2="234" y2="64" stroke="#fc8181" stroke-width="2.5" stroke-dasharray="5,3" marker-end="url(#adv)"/>
  <text x="263" y="105" fill="#fc8181" font-size="13" font-family="monospace">Δv</text>
  <circle cx="150" cy="140" r="4" fill="#718096"/>
  <text x="40" y="28" fill="#718096" font-size="12" font-family="monospace">Both vectors have</text>
  <text x="40" y="45" fill="#718096" font-size="12" font-family="monospace">magnitude v but</text>
  <text x="40" y="62" fill="#718096" font-size="12" font-family="monospace">differ by angle Δθ.</text>
</svg>
<p style="color: #718096; font-size: 0.85rem; margin-top: 0.5rem; font-family: monospace;">
  Placing v₁ and v₂ tail-to-tail reveals Δv — the change in velocity.
</p>
</div>

Both $v_1$ and $v_2$ have the same magnitude $v$ (speed is constant). The angle between them is $\Delta\theta$.

For **small** angles, the chord connecting the tips of two equal-length vectors is approximately equal to the arc between them. So:

$$|\Delta v| \approx v \cdot \Delta\theta$$

---

## Step 5: Plug In and Simplify

We now have two expressions. From Step 3:

$$\Delta\theta = \frac{v \cdot \Delta t}{r}$$

Substituting into the expression for $\Delta v$:

$$|\Delta v| = v \cdot \Delta\theta = v \cdot \frac{v \cdot \Delta t}{r} = \frac{v^2 \cdot \Delta t}{r}$$

Acceleration is defined as the change in velocity divided by time elapsed:

$$a = \frac{|\Delta v|}{\Delta t} = \frac{v^2 \cdot \Delta t}{r \cdot \Delta t}$$

The $\Delta t$ cancels, and we get:

<div style="background: rgba(99,179,237,0.08); border: 1px solid rgba(99,179,237,0.25); border-radius: 8px; padding: 1.5rem; margin: 2rem 0; text-align: center;">

$$a = \frac{v^2}{r}$$

<p style="color: #718096; font-size: 0.85rem; margin: 0.5rem 0 0; font-family: monospace;">centripetal acceleration = speed² / radius</p>
</div>

---

## Step 6: Does It Make Sense?

| Scenario | What the formula predicts |
|---|---|
| Double the speed, same circle | 4× more acceleration ($v$ is squared!) |
| Double the radius, same speed | Half the acceleration |
| Straight line ($r \to \infty$) | Acceleration $\to 0$ ✓ |

The last row is beautiful: as the radius grows to infinity, the path becomes a straight line, and the formula correctly tells you there's no centripetal acceleration needed. Straight-line motion requires no force to maintain direction.

---

## The Takeaway

We derived $a = v^2/r$ using nothing more than:

1. The definition of arc length: $\Delta s = r \cdot \Delta\theta$
2. The definition of speed: $\Delta s = v \cdot \Delta t$
3. The velocity vector rotates at the same rate as the position vector
4. The definition of acceleration: $a = \Delta v / \Delta t$

No calculus. No tricks. Just careful geometry and the willingness to think about what "changing direction" really means.

The next time you spin something on a string or take a corner too fast in a car, you'll know exactly what's happening: the velocity is being *re-aimed*, and that re-aiming requires a force pointed squarely at the centre of the curve.

---

*This is part of an ongoing series on physics for curious minds. If you want to go deeper, try deriving the same result using calculus — you'll find the answer comes out even more cleanly.*
