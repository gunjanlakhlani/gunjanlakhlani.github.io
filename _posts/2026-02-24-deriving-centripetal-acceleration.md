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
<!-- FIGURE 1: Circular orbit showing velocity tangent and acceleration inward -->
<!-- Canvas: 600 × 580. Centre at (300, 290). Orbit radius 200px. -->
<!-- Ball 1: top → (300, 90). Velocity → rightward. Acceleration → downward (toward centre). -->
<!-- Ball 2: right → (500, 290). Velocity → downward. Acceleration → leftward (toward centre). -->
<svg viewBox="0 0 600 580" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;display:block;margin:0 auto;">
  <defs>
    <!-- Ball gradient: blue sphere -->
    <radialGradient id="f1ball" cx="38%" cy="30%" r="62%">
      <stop offset="0%" stop-color="#bfdbfe"/>
      <stop offset="45%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1e3a8a"/>
    </radialGradient>
    <!-- Arrow: velocity (emerald green) -->
    <marker id="f1arrowV" markerWidth="12" markerHeight="9" refX="11" refY="4.5" orient="auto">
      <polygon points="0 0, 12 4.5, 0 9" fill="#10b981"/>
    </marker>
    <!-- Arrow: acceleration (rose red) -->
    <marker id="f1arrowA" markerWidth="12" markerHeight="9" refX="11" refY="4.5" orient="auto">
      <polygon points="0 0, 12 4.5, 0 9" fill="#ef4444"/>
    </marker>
    <!-- Arrow: radius (slate) -->
    <marker id="f1arrowR" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#64748b"/>
    </marker>
  </defs>

  <!-- ── Orbit circle ── -->
  <circle cx="300" cy="290" r="200" fill="rgba(59,130,246,0.035)" stroke="#334155" stroke-width="2" stroke-dasharray="10,6"/>

  <!-- ── Centre point O ── -->
  <circle cx="300" cy="290" r="5" fill="#64748b"/>
  <text x="313" y="296" fill="#94a3b8" font-size="20" font-family="Georgia,'Times New Roman',serif" font-style="italic">O</text>

  <!-- ── Ball 1 at top (300, 90) ── -->
  <!-- Radius line: centre → ball1 -->
  <line x1="300" y1="290" x2="300" y2="104" stroke="#475569" stroke-width="1.5" stroke-dasharray="7,5"/>
  <!-- Radius label -->
  <text x="308" y="198" fill="#94a3b8" font-size="19" font-family="Georgia,'Times New Roman',serif" font-style="italic">r</text>
  <!-- Ball -->
  <circle cx="300" cy="90" r="18" fill="url(#f1ball)" stroke="#93c5fd" stroke-width="1.5"/>
  <!-- Velocity: tangent = rightward (pointing right along orbit) -->
  <line x1="318" y1="90" x2="430" y2="90" stroke="#10b981" stroke-width="3.5" marker-end="url(#f1arrowV)"/>
  <text x="438" y="96" fill="#10b981" font-size="21" font-family="Georgia,'Times New Roman',serif" font-style="italic" font-weight="bold">v</text>
  <!-- Acceleration: toward centre = downward -->
  <line x1="300" y1="108" x2="300" y2="198" stroke="#ef4444" stroke-width="3.5" marker-end="url(#f1arrowA)"/>
  <text x="176" y="162" fill="#ef4444" font-size="17" font-family="Georgia,'Times New Roman',serif" font-style="italic">acceleration</text>

  <!-- ── Ball 2 at right (500, 290) ── -->
  <!-- Radius line: centre → ball2 -->
  <line x1="300" y1="290" x2="482" y2="290" stroke="#475569" stroke-width="1.5" stroke-dasharray="7,5"/>
  <!-- Radius label -->
  <text x="386" y="282" fill="#94a3b8" font-size="19" font-family="Georgia,'Times New Roman',serif" font-style="italic">r</text>
  <!-- Ball -->
  <circle cx="500" cy="290" r="18" fill="url(#f1ball)" stroke="#93c5fd" stroke-width="1.5"/>
  <!-- Velocity: tangent = downward -->
  <line x1="500" y1="308" x2="500" y2="420" stroke="#10b981" stroke-width="3.5" marker-end="url(#f1arrowV)"/>
  <text x="510" y="370" fill="#10b981" font-size="21" font-family="Georgia,'Times New Roman',serif" font-style="italic" font-weight="bold">v</text>
  <!-- Acceleration: toward centre = leftward -->
  <line x1="482" y1="290" x2="366" y2="290" stroke="#ef4444" stroke-width="3.5" marker-end="url(#f1arrowA)"/>

  <!-- ── Legend ── -->
  <rect x="30" y="510" width="260" height="50" rx="6" fill="rgba(15,23,42,0.6)" stroke="#1e293b" stroke-width="1"/>
  <line x1="50" y1="535" x2="90" y2="535" stroke="#10b981" stroke-width="3" marker-end="url(#f1arrowV)"/>
  <text x="98" y="540" fill="#94a3b8" font-size="15" font-family="Georgia,'Times New Roman',serif">velocity  <tspan font-style="italic">v</tspan></text>
  <line x1="170" y1="535" x2="210" y2="535" stroke="#ef4444" stroke-width="3" marker-end="url(#f1arrowA)"/>
  <text x="218" y="540" fill="#94a3b8" font-size="15" font-family="Georgia,'Times New Roman',serif">acceleration</text>
</svg>
<p class="fig-caption"><strong>Figure 1.</strong> The velocity <em>v</em> (green) is always tangent to the circular path, perpendicular to the radius. The centripetal acceleration (red) always points inward toward the centre <em>O</em>.</p>
</div>

Notice two things:
1. **The velocity vector is always perpendicular to the radius** — it points *along* the circle, not toward the centre.
2. **The acceleration always points toward the centre** — it's constantly pulling the ball inward.

---

## Step 3: Watch What Happens in a Short Time Interval

Imagine the ball is at position **A**, and a tiny moment later — call it $\Delta t$ — it's at position **B**.

<div class="fig-wrap">
<!-- FIGURE 2: Ball moves from A to B along arc, showing Δs and Δθ -->
<!-- Canvas 600 × 520. Centre O at (460, 440). Radius 300. -->
<!-- Ball A at angle 210° from O: (460+300·cos210, 440+300·sin210) = (460-260, 440-150) = (200, 290) -->
<!-- Ball B at angle 280° from O: (460+300·cos280, 440+300·sin280) = (460+52, 440-295) = (512, 145) - adjust -->
<!-- Let me use simpler coords: O at (430, 460). r=280. A at angle 200°, B at angle 255°. -->
<!-- A: (430+280·cos200, 460+280·sin200) = (430-263, 460-96) = (167, 364) -->
<!-- B: (430+280·cos255, 460+280·sin255) = (430-72, 460-270) = (358, 190) -->
<!-- Tangent at A (perp to radius OA): radius dir = (cos200,sin200)=(-0.94,-0.34), tangent = (0.34,-0.94) → (0.34,-0.94) → points up-right -->
<!-- Tangent at B (perp to radius OB): radius dir = (cos255,sin255)=(-0.26,-0.97), tangent = (0.97,-0.26) → points right-up -->
<svg viewBox="0 0 600 510" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;display:block;margin:0 auto;">
  <defs>
    <radialGradient id="f2ball" cx="38%" cy="30%" r="62%">
      <stop offset="0%" stop-color="#bfdbfe"/>
      <stop offset="45%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1e3a8a"/>
    </radialGradient>
    <marker id="f2arrowV" markerWidth="12" markerHeight="9" refX="11" refY="4.5" orient="auto">
      <polygon points="0 0, 12 4.5, 0 9" fill="#a78bfa"/>
    </marker>
    <marker id="f2arrowS" markerWidth="12" markerHeight="9" refX="11" refY="4.5" orient="auto">
      <polygon points="0 0, 12 4.5, 0 9" fill="#10b981"/>
    </marker>
  </defs>

  <!-- Faint full orbit arc — only partial shown for context -->
  <path d="M 90,430 A 350,350 0 0,1 555,200" fill="none" stroke="#1e293b" stroke-width="1.5" stroke-dasharray="8,5"/>

  <!-- O at (430, 460) -->
  <circle cx="430" cy="460" r="5" fill="#64748b"/>
  <text x="442" y="466" fill="#94a3b8" font-size="20" font-family="Georgia,'Times New Roman',serif" font-style="italic">O</text>

  <!-- Radius OA: to A at (167, 364) -->
  <line x1="430" y1="460" x2="185" y2="370" stroke="#475569" stroke-width="1.5" stroke-dasharray="7,4"/>
  <text x="278" y="438" fill="#94a3b8" font-size="19" font-family="Georgia,'Times New Roman',serif" font-style="italic">r</text>

  <!-- Radius OB: to B at (358, 190) -->
  <line x1="430" y1="460" x2="362" y2="208" stroke="#475569" stroke-width="1.5" stroke-dasharray="7,4"/>
  <text x="415" y="330" fill="#94a3b8" font-size="19" font-family="Georgia,'Times New Roman',serif" font-style="italic">r</text>

  <!-- Angle arc Δθ at O between OA and OB -->
  <!-- OA direction: angle ≈ 200° (measuring from +x axis going CCW in SVG = CW visually) -->
  <!-- In SVG coords: A is at upper-left of O, so the angle from O to A measured from O is roughly NW -->
  <!-- Approximate arc from (400,430) sweeping to show angle -->
  <path d="M 392,432 A 50,50 0 0,0 415,404" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
  <text x="354" y="418" fill="#f59e0b" font-size="18" font-family="Georgia,'Times New Roman',serif" font-style="italic">Δθ</text>

  <!-- Arc Δs from A to B (the green path) -->
  <path d="M 167,364 A 290,290 0 0,1 358,190" fill="none" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
  <!-- Arc label midpoint roughly at (210, 240) -->
  <text x="165" y="232" fill="#10b981" font-size="18" font-family="Georgia,'Times New Roman',serif" font-style="italic">Δs = v · Δt</text>

  <!-- Ball A at (167, 364) -->
  <circle cx="167" cy="364" r="18" fill="url(#f2ball)" stroke="#93c5fd" stroke-width="1.5"/>
  <text x="122" y="358" fill="#e0f2fe" font-size="21" font-family="Georgia,'Times New Roman',serif" font-weight="bold">A</text>

  <!-- Velocity v₁ at A: tangent direction (perpendicular to OA, going CCW) -->
  <!-- OA vector: (-263, -96), normalized: unit = (-0.939,-0.343). Tangent CCW: (0.343, -0.939) scaled 90 -->
  <!-- v1 tip: (167 + 0.343×100, 364 + (-0.939)×100) = (201, 270) -->
  <line x1="167" y1="364" x2="198" y2="266" stroke="#a78bfa" stroke-width="3" marker-end="url(#f2arrowV)"/>
  <text x="202" y="260" fill="#a78bfa" font-size="18" font-family="Georgia,'Times New Roman',serif" font-style="italic">v₁</text>

  <!-- Ball B at (358, 190) -->
  <circle cx="358" cy="190" r="18" fill="url(#f2ball)" stroke="#93c5fd" stroke-width="1.5"/>
  <text x="370" y="182" fill="#e0f2fe" font-size="21" font-family="Georgia,'Times New Roman',serif" font-weight="bold">B</text>

  <!-- Velocity v₂ at B: tangent CCW -->
  <!-- OB vector: (-72, -270), unit = (-0.258,-0.966). Tangent CCW: (0.966, -0.258) scaled 90 -->
  <!-- v2 tip: (358 + 0.966×95, 190 + (-0.258)×95) = (358+92, 190-25) = (450, 165) -->
  <line x1="358" y1="190" x2="448" y2="166" stroke="#a78bfa" stroke-width="3" marker-end="url(#f2arrowV)"/>
  <text x="453" y="162" fill="#a78bfa" font-size="18" font-family="Georgia,'Times New Roman',serif" font-style="italic">v₂</text>

  <!-- Right-angle mark at A (showing v₁ ⊥ to OA) -->
  <!-- OA direction unit: (-0.939,-0.343). Tangent: (0.343,-0.939) -->
  <!-- Corner: from A go 14 in OA dir → (167-13.1, 364-4.8) = (154,359) -->
  <!-- then add tangent component → (154+4.8, 359-13.1) = (159, 346) -->
  <!-- then close back to (167+4.8, 364-13.1)=(172,351) →  A -->
  <path d="M 154,359 L 159,346 L 172,351" fill="none" stroke="#475569" stroke-width="1.5"/>
</svg>
<p class="fig-caption"><strong>Figure 2.</strong> In time $\Delta t$, the ball moves from <strong>A</strong> to <strong>B</strong> along the arc. The arc length $\Delta s = v\,\Delta t$ and the central angle swept is $\Delta\theta$, so $\Delta\theta = \Delta s / r$. The velocity vectors $v_1$ and $v_2$ are perpendicular to their respective radii.</p>
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
<!-- FIGURE 3: Velocity triangle — v1, v2 placed tail-to-tail, Δv is the chord -->
<!-- Canvas: 600 × 460. Tail common origin at (180, 300). -->
<!-- v₁: horizontal rightward, length 220. Tip at (400, 300). -->
<!-- Δθ ≈ 40°. v₂: at 40° above v₁. Tip at (180+220·cos40, 300-220·sin40) = (180+169, 300-141) = (349, 159) -->
<!-- Δv: from tip of v₁ (400,300) to tip of v₂ (349,159) -->
<svg viewBox="0 0 600 460" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;display:block;margin:0 auto;">
  <defs>
    <marker id="f3arrowV1" markerWidth="12" markerHeight="9" refX="11" refY="4.5" orient="auto">
      <polygon points="0 0, 12 4.5, 0 9" fill="#a78bfa"/>
    </marker>
    <marker id="f3arrowV2" markerWidth="12" markerHeight="9" refX="11" refY="4.5" orient="auto">
      <polygon points="0 0, 12 4.5, 0 9" fill="#f59e0b"/>
    </marker>
    <marker id="f3arrowDV" markerWidth="12" markerHeight="9" refX="11" refY="4.5" orient="auto">
      <polygon points="0 0, 12 4.5, 0 9" fill="#ef4444"/>
    </marker>
  </defs>

  <!-- Common tail -->
  <circle cx="180" cy="300" r="6" fill="#64748b"/>
  <text x="155" y="325" fill="#94a3b8" font-size="15" font-family="Georgia,'Times New Roman',serif" font-style="italic">tail</text>

  <!-- v₁: rightward to (400, 300) -->
  <line x1="180" y1="300" x2="388" y2="300" stroke="#a78bfa" stroke-width="4" marker-end="url(#f3arrowV1)"/>
  <text x="410" y="308" fill="#a78bfa" font-size="22" font-family="Georgia,'Times New Roman',serif" font-style="italic">v₁</text>

  <!-- v₂: at 40° above horizontal to (349, 159) -->
  <line x1="180" y1="300" x2="337" y2="163" stroke="#f59e0b" stroke-width="4" marker-end="url(#f3arrowV2)"/>
  <text x="342" y="150" fill="#f59e0b" font-size="22" font-family="Georgia,'Times New Roman',serif" font-style="italic">v₂</text>

  <!-- Δv: from tip of v₁ (400,300) to tip of v₂ (349,159), dashed red -->
  <line x1="400" y1="300" x2="352" y2="169" stroke="#ef4444" stroke-width="3.5" stroke-dasharray="9,4" marker-end="url(#f3arrowDV)"/>
  <text x="416" y="238" fill="#ef4444" font-size="22" font-family="Georgia,'Times New Roman',serif" font-style="italic">Δv</text>

  <!-- Angle arc Δθ at tail, between v₁ and v₂ -->
  <!-- From (180+60,300) sweeping up-left to (180+cos40×60, 300-sin40×60) = (226, 261) -->
  <path d="M 240,300 A 60,60 0 0,0 226,261" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="4,3"/>
  <text x="248" y="278" fill="#94a3b8" font-size="18" font-family="Georgia,'Times New Roman',serif" font-style="italic">Δθ</text>

  <!-- Equal-length tick marks on v₁ and v₂ -->
  <!-- Midpoint of v₁: (290, 300). Perpendicular tick: vertical -->
  <line x1="290" y1="291" x2="290" y2="309" stroke="#64748b" stroke-width="2"/>
  <!-- Midpoint of v₂: (260, 232). Perpendicular to v₂ direction (cos40,sin40) = (0.766,0.643); perp = (-0.643,0.766)? No — in SVG y is down. v₂ dir = (cos(-40), sin(-40)) in screen = (0.766,-0.643). Perp = (0.643, 0.766). -->
  <!-- tick from (260-0.643×8, 232-0.766×8) to (260+0.643×8, 232+0.766×8) = (254.9,225.9)→(265.1,238.1) -->
  <line x1="255" y1="226" x2="265" y2="238" stroke="#64748b" stroke-width="2"/>

  <!-- Label showing equal magnitude -->
  <text x="30" y="60" fill="#94a3b8" font-size="18" font-family="Georgia,'Times New Roman',serif">|<tspan font-style="italic">v₁</tspan>| = |<tspan font-style="italic">v₂</tspan>| = <tspan font-style="italic">v</tspan></text>
  <text x="30" y="85" fill="#64748b" font-size="15" font-family="Georgia,'Times New Roman',serif">(speed is constant — only direction changes)</text>

  <!-- Faint circle arc showing both vectors have same radius (to make geometry clear) -->
  <path d="M 400,300 A 220,220 0 0,0 349,159" fill="none" stroke="#1e293b" stroke-width="1" stroke-dasharray="3,5"/>

  <!-- Small formula note bottom right -->
  <text x="30" y="420" fill="#475569" font-size="15" font-family="Georgia,'Times New Roman',serif">For small <tspan font-style="italic">Δθ</tspan>: chord ≈ arc, so |<tspan font-style="italic">Δv</tspan>| ≈ <tspan font-style="italic">v</tspan> · <tspan font-style="italic">Δθ</tspan></text>
</svg>
<p class="fig-caption"><strong>Figure 3.</strong> Placing $\mathbf{v}_1$ and $\mathbf{v}_2$ tail-to-tail. Both have magnitude $v$ (tick marks) but are rotated by $\Delta\theta$. The red dashed chord connecting their tips is $\Delta\mathbf{v}$, the change in velocity. For small angles, $|\Delta v| \approx v\,\Delta\theta$.</p>
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
