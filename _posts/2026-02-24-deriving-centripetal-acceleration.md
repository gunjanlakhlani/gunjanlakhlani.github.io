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

<div class="fig-wrap">
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px;display:block;margin:0 auto;">
  <defs>
    <!-- Gradient for the ball -->
    <radialGradient id="ballGrad1" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#93c5fd"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </radialGradient>
    <!-- Glow filter for vectors -->
    <filter id="glow1" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <!-- Arrowhead: velocity (teal-green) -->
    <marker id="arrowV1" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#34d399"/>
    </marker>
    <!-- Arrowhead: acceleration (rose) -->
    <marker id="arrowA1" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#f87171"/>
    </marker>
    <!-- Arrowhead: radius (slate) -->
    <marker id="arrowR1" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#94a3b8"/>
    </marker>
  </defs>

  <!-- Subtle background circle fill -->
  <circle cx="200" cy="200" r="140" fill="rgba(99,102,241,0.04)" stroke="none"/>

  <!-- Orbit circle -->
  <circle cx="200" cy="200" r="140" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="8,5"/>

  <!-- Centre point -->
  <circle cx="200" cy="200" r="4" fill="#64748b"/>
  <text x="212" y="205" fill="#94a3b8" font-size="15" font-family="Georgia, 'Times New Roman', serif" font-style="italic">O</text>

  <!-- Radius lines (two balls shown) -->
  <!-- Ball 1 at top (200, 60) -->
  <line x1="200" y1="200" x2="200" y2="70" stroke="#475569" stroke-width="1.2" stroke-dasharray="5,4" marker-end="url(#arrowR1)"/>
  <text x="208" y="138" fill="#94a3b8" font-size="15" font-family="Georgia, 'Times New Roman', serif" font-style="italic">r</text>

  <!-- Ball 2 at right (340, 200) -->
  <line x1="200" y1="200" x2="330" y2="200" stroke="#475569" stroke-width="1.2" stroke-dasharray="5,4" marker-end="url(#arrowR1)"/>
  <text x="262" y="193" fill="#94a3b8" font-size="15" font-family="Georgia, 'Times New Roman', serif" font-style="italic">r</text>

  <!-- Ball 1 at top -->
  <circle cx="200" cy="60" r="13" fill="url(#ballGrad1)" stroke="#60a5fa" stroke-width="1.5"/>

  <!-- Velocity vector for ball 1 (tangent = rightward) -->
  <line x1="200" y1="60" x2="290" y2="60" stroke="#34d399" stroke-width="2.5" marker-end="url(#arrowV1)" filter="url(#glow1)"/>
  <text x="295" y="65" fill="#34d399" font-size="15" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-weight="bold">v</text>

  <!-- Acceleration vector for ball 1 (toward centre = downward) -->
  <line x1="200" y1="72" x2="200" y2="130" stroke="#f87171" stroke-width="2.5" marker-end="url(#arrowA1)" filter="url(#glow1)"/>
  <text x="146" y="108" fill="#f87171" font-size="12" font-family="Georgia, 'Times New Roman', serif" font-style="italic">acceleration</text>

  <!-- Ball 2 at right -->
  <circle cx="340" cy="200" r="13" fill="url(#ballGrad1)" stroke="#60a5fa" stroke-width="1.5"/>

  <!-- Velocity vector for ball 2 (tangent = downward) -->
  <line x1="340" y1="200" x2="340" y2="290" stroke="#34d399" stroke-width="2.5" marker-end="url(#arrowV1)" filter="url(#glow1)"/>
  <text x="348" y="250" fill="#34d399" font-size="15" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-weight="bold">v</text>

  <!-- Acceleration vector for ball 2 (toward centre = leftward) -->
  <line x1="328" y1="200" x2="268" y2="200" stroke="#f87171" stroke-width="2.5" marker-end="url(#arrowA1)" filter="url(#glow1)"/>

  <!-- Legend -->
  <line x1="30" y1="348" x2="60" y2="348" stroke="#34d399" stroke-width="2.5" marker-end="url(#arrowV1)"/>
  <text x="68" y="353" fill="#94a3b8" font-size="12" font-family="Georgia, 'Times New Roman', serif">velocity</text>
  <line x1="150" y1="348" x2="180" y2="348" stroke="#f87171" stroke-width="2.5" marker-end="url(#arrowA1)"/>
  <text x="188" y="353" fill="#94a3b8" font-size="12" font-family="Georgia, 'Times New Roman', serif">acceleration</text>
</svg>
<p class="fig-caption"><strong>Figure 1.</strong> The velocity (green) is always tangent to the circular path, while the centripetal acceleration (red) always points toward the centre <em>O</em>.</p>
</div>

Notice two things:
1. **The velocity vector is always perpendicular to the radius** — it points *along* the circle, not toward the centre.
2. **The acceleration always points toward the centre** — it's constantly pulling the ball inward.

---

## Step 3: Watch What Happens in a Short Time Interval

Imagine the ball is at position **A**, and a tiny moment later — call it $\Delta t$ — it's at position **B**.

<div class="fig-wrap">
<svg viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:480px;display:block;margin:0 auto;">
  <defs>
    <radialGradient id="ballGrad2" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#93c5fd"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </radialGradient>
    <filter id="glow2" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <!-- Velocity vectors: purple -->
    <marker id="arrowVp" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#a78bfa"/>
    </marker>
    <!-- Arc indicator: amber -->
    <marker id="arrowArc" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#34d399"/>
    </marker>
    <!-- Radius: slate dashed -->
  </defs>

  <!-- Origin O at bottom-right area -->
  <!-- Ball A at (80, 260), Ball B at (310, 80), Centre O at (310, 310) -->

  <!-- Large orbit arc (dashed, subtle) -->
  <path d="M 50,290 A 185,185 0 0,1 320,60" fill="none" stroke="#334155" stroke-width="1.5" stroke-dasharray="7,5"/>

  <!-- Centre dot O -->
  <circle cx="310" cy="310" r="5" fill="#64748b"/>
  <text x="320" y="316" fill="#94a3b8" font-size="16" font-family="Georgia, 'Times New Roman', serif" font-style="italic">O</text>

  <!-- Radius to A -->
  <line x1="310" y1="310" x2="82" y2="258" stroke="#475569" stroke-width="1.3" stroke-dasharray="6,4"/>
  <text x="175" y="310" fill="#94a3b8" font-size="15" font-family="Georgia, 'Times New Roman', serif" font-style="italic">r</text>

  <!-- Radius to B -->
  <line x1="310" y1="310" x2="312" y2="82" stroke="#475569" stroke-width="1.3" stroke-dasharray="6,4"/>
  <text x="318" y="200" fill="#94a3b8" font-size="15" font-family="Georgia, 'Times New Roman', serif" font-style="italic">r</text>

  <!-- Angle arc Δθ at O -->
  <path d="M 310,270 A 40,40 0 0,0 272,297" fill="none" stroke="#f59e0b" stroke-width="1.8"/>
  <text x="255" y="285" fill="#f59e0b" font-size="14" font-family="Georgia, 'Times New Roman', serif" font-style="italic">Δθ</text>

  <!-- Arc from A to B (the path Δs, thick green) -->
  <path d="M 82,258 A 185,185 0 0,1 312,82" fill="none" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>
  <!-- Arc label -->
  <text x="148" y="135" fill="#34d399" font-size="13" font-family="Georgia, 'Times New Roman', serif" font-style="italic">Δs = v·Δt</text>

  <!-- Ball A -->
  <circle cx="82" cy="258" r="14" fill="url(#ballGrad2)" stroke="#60a5fa" stroke-width="1.5"/>
  <text x="48" y="254" fill="#93c5fd" font-size="15" font-family="Georgia, 'Times New Roman', serif" font-weight="bold">A</text>

  <!-- Velocity v₁ at A (tangent direction ≈ upper-left from A) -->
  <line x1="82" y1="258" x2="130" y2="182" stroke="#a78bfa" stroke-width="2.5" marker-end="url(#arrowVp)" filter="url(#glow2)"/>
  <text x="136" y="178" fill="#a78bfa" font-size="14" font-family="Georgia, 'Times New Roman', serif" font-style="italic">v₁</text>

  <!-- Ball B -->
  <circle cx="312" cy="82" r="14" fill="url(#ballGrad2)" stroke="#60a5fa" stroke-width="1.5"/>
  <text x="330" y="86" fill="#93c5fd" font-size="15" font-family="Georgia, 'Times New Roman', serif" font-weight="bold">B</text>

  <!-- Velocity v₂ at B (tangent direction ≈ leftward from B) -->
  <line x1="312" y1="82" x2="230" y2="68" stroke="#a78bfa" stroke-width="2.5" marker-end="url(#arrowVp)" filter="url(#glow2)"/>
  <text x="214" y="62" fill="#a78bfa" font-size="14" font-family="Georgia, 'Times New Roman', serif" font-style="italic">v₂</text>

  <!-- Right-angle indicator at A (showing v perpendicular to r) -->
  <!-- small box -->
  <path d="M 94,243 L 108,252 L 99,266" fill="none" stroke="#475569" stroke-width="1"/>
</svg>
<p class="fig-caption"><strong>Figure 2.</strong> In time $\Delta t$, the ball moves from <strong>A</strong> to <strong>B</strong> along the arc. The arc length is $\Delta s = v\,\Delta t$ and the central angle swept is $\Delta\theta$. The velocity vectors $v_1$ and $v_2$ are each perpendicular to their respective radii.</p>
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

<div class="fig-wrap">
<svg viewBox="0 0 420 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px;display:block;margin:0 auto;">
  <defs>
    <filter id="glow3" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <marker id="arrowV3a" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#a78bfa"/>
    </marker>
    <marker id="arrowV3b" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b"/>
    </marker>
    <marker id="arrowDV" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#f87171"/>
    </marker>
  </defs>

  <!-- Tail point of both vectors -->
  <circle cx="160" cy="190" r="4" fill="#64748b"/>

  <!-- v₁: rightward (purple) — length 130 -->
  <line x1="160" y1="190" x2="285" y2="190" stroke="#a78bfa" stroke-width="2.8" marker-end="url(#arrowV3a)" filter="url(#glow3)"/>
  <text x="290" y="195" fill="#a78bfa" font-size="15" font-family="Georgia, 'Times New Roman', serif" font-style="italic">v₁</text>

  <!-- v₂: angled ~55° above horizontal (amber) — length 130 -->
  <!-- End point: 160+130·cos55°, 190-130·sin55° ≈ 160+74.6, 190-106.5 = (235, 84) -->
  <line x1="160" y1="190" x2="235" y2="84" stroke="#f59e0b" stroke-width="2.8" marker-end="url(#arrowV3b)" filter="url(#glow3)"/>
  <text x="240" y="78" fill="#f59e0b" font-size="15" font-family="Georgia, 'Times New Roman', serif" font-style="italic">v₂</text>

  <!-- Δv: from tip of v₁ (285,190) to tip of v₂ (235,84), dashed red -->
  <line x1="285" y1="190" x2="237" y2="88" stroke="#f87171" stroke-width="2.5" stroke-dasharray="6,3" marker-end="url(#arrowDV)" filter="url(#glow3)"/>
  <text x="292" y="145" fill="#f87171" font-size="15" font-family="Georgia, 'Times New Roman', serif" font-style="italic">Δv</text>

  <!-- Angle arc Δθ near tail -->
  <path d="M 240,190 A 80,80 0 0,0 214,131" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="246" y="168" fill="#94a3b8" font-size="13" font-family="Georgia, 'Times New Roman', serif" font-style="italic">Δθ</text>

  <!-- Equal length tick marks showing |v₁| = |v₂| -->
  <!-- tick on v₁ at midpoint (222,190) -->
  <line x1="222" y1="183" x2="222" y2="197" stroke="#64748b" stroke-width="1.5"/>
  <!-- tick on v₂ at midpoint ~ (197, 137) -->
  <line x1="191" y1="139" x2="203" y2="131" stroke="#64748b" stroke-width="1.5"/>

  <!-- Label: |v₁| = |v₂| = v -->
  <text x="22" y="40" fill="#94a3b8" font-size="13" font-family="Georgia, 'Times New Roman', serif" font-style="italic">|v₁| = |v₂| = v</text>
  <text x="22" y="60" fill="#64748b" font-size="12" font-family="Georgia, 'Times New Roman', serif">(speed constant)</text>

  <!-- Small arc showing the triangle relation -->
  <!-- Faint arc connecting tips of v₁ and v₂ centered at tail -->
  <path d="M 285,190 A 130,130 0 0,0 235,84" fill="none" stroke="#1e293b" stroke-width="1" stroke-dasharray="3,4"/>

  <!-- Caption note bottom -->
  <text x="30" y="295" fill="#64748b" font-size="12" font-family="Georgia, 'Times New Roman', serif">For small Δθ: chord ≈ arc, so |Δv| ≈ v · Δθ</text>
</svg>
<p class="fig-caption"><strong>Figure 3.</strong> Placing $\mathbf{v}_1$ and $\mathbf{v}_2$ tail-to-tail. Both have magnitude $v$ but are rotated by $\Delta\theta$. The chord connecting their tips is $\Delta\mathbf{v}$, the change in velocity. For small angles, $|\Delta v| \approx v\,\Delta\theta$.</p>
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

<div style="background: rgba(99,179,237,0.08); border: 1px solid rgba(99,179,237,0.25); border-radius: 8px; padding: 1.5rem; margin: 2rem 0; text-align: center;" markdown="1">

$$\boxed{a = \frac{v^2}{r}}$$

<p style="color: #94a3b8; font-size: 0.85rem; margin: 0.5rem 0 0; font-family: Georgia, 'Times New Roman', serif; font-style: italic;">centripetal acceleration = speed² / radius</p>
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
