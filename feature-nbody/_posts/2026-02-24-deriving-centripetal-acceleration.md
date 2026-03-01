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
<!--
  FIGURE 1: Square 500×500 canvas.
  Orbit: centre (250,252), radius 175.
  Ball 1 at top: (250, 77). Velocity rightward. Acceleration downward.
  Ball 2 at right: (425, 252). Velocity downward. Acceleration leftward.
-->
<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:500px;display:block;margin:0 auto;">
  <defs>
    <radialGradient id="g1b" cx="35%" cy="25%" r="65%">
      <stop offset="0%" stop-color="#dbeafe"/>
      <stop offset="40%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1e3a8a"/>
    </radialGradient>
    <marker id="g1v" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
      <polygon points="0 0, 10 4, 0 8" fill="#10b981"/>
    </marker>
    <marker id="g1a" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
      <polygon points="0 0, 10 4, 0 8" fill="#f87171"/>
    </marker>
    <marker id="g1r" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#64748b"/>
    </marker>
  </defs>

  <!-- faint tinted fill inside orbit -->
  <circle cx="250" cy="252" r="175" fill="rgba(59,130,246,0.05)" />
  <!-- orbit circle -->
  <circle cx="250" cy="252" r="175" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="10,6"/>

  <!-- centre O -->
  <circle cx="250" cy="252" r="5.5" fill="#64748b"/>
  <text x="262" y="257" font-size="20" font-family="Georgia,'Times New Roman',serif" font-style="italic" fill="#94a3b8">O</text>

  <!-- --- BALL 1: top (250, 77) --- -->
  <!-- radius line, stopping 18px short of ball edge -->
  <line x1="250" y1="247" x2="250" y2="97" stroke="#475569" stroke-width="1.8" stroke-dasharray="7,5" marker-end="url(#g1r)"/>
  <!-- radius label -->
  <text x="258" y="178" font-size="19" font-family="Georgia,'Times New Roman',serif" font-style="italic" fill="#64748b">r</text>
  <!-- ball -->
  <circle cx="250" cy="77" r="20" fill="url(#g1b)" stroke="#93c5fd" stroke-width="1.5"/>
  <!-- velocity: rightward 110px -->
  <line x1="270" y1="77" x2="388" y2="77" stroke="#10b981" stroke-width="3.5" marker-end="url(#g1v)"/>
  <text x="396" y="83" font-size="22" font-family="Georgia,'Times New Roman',serif" font-style="italic" fill="#10b981" font-weight="bold">v</text>
  <!-- acceleration: downward 90px -->
  <line x1="250" y1="97" x2="250" y2="187" stroke="#f87171" stroke-width="3.5" marker-end="url(#g1a)"/>
  <text x="154" y="150" font-size="16" font-family="Georgia,'Times New Roman',serif" font-style="italic" fill="#f87171">acceleration</text>

  <!-- --- BALL 2: right (425, 252) --- -->
  <!-- radius line -->
  <line x1="255" y1="252" x2="405" y2="252" stroke="#475569" stroke-width="1.8" stroke-dasharray="7,5" marker-end="url(#g1r)"/>
  <text x="322" y="245" font-size="19" font-family="Georgia,'Times New Roman',serif" font-style="italic" fill="#64748b">r</text>
  <!-- ball -->
  <circle cx="425" cy="252" r="20" fill="url(#g1b)" stroke="#93c5fd" stroke-width="1.5"/>
  <!-- velocity: downward 110px -->
  <line x1="425" y1="272" x2="425" y2="388" stroke="#10b981" stroke-width="3.5" marker-end="url(#g1v)"/>
  <text x="434" y="335" font-size="22" font-family="Georgia,'Times New Roman',serif" font-style="italic" fill="#10b981" font-weight="bold">v</text>
  <!-- acceleration: leftward 90px -->
  <line x1="405" y1="252" x2="310" y2="252" stroke="#f87171" stroke-width="3.5" marker-end="url(#g1a)"/>

  <!-- legend box bottom-left -->
  <rect x="20" y="440" width="226" height="44" rx="5" fill="rgba(15,23,42,0.7)" stroke="#1e293b" stroke-width="1"/>
  <line x1="34" y1="462" x2="68" y2="462" stroke="#10b981" stroke-width="3" marker-end="url(#g1v)"/>
  <text x="76" y="467" font-size="14" font-family="Georgia,'Times New Roman',serif" fill="#94a3b8">velocity</text>
  <line x1="138" y1="462" x2="172" y2="462" stroke="#f87171" stroke-width="3" marker-end="url(#g1a)"/>
  <text x="180" y="467" font-size="14" font-family="Georgia,'Times New Roman',serif" fill="#94a3b8">acceleration</text>
</svg>
<p class="fig-caption"><strong>Figure 1.</strong> At any point on the circular path, the velocity <em>v</em> (green) is tangent to the orbit and the centripetal acceleration (red) points toward the centre <em>O</em>.</p>
</div>

Notice two things:
1. **The velocity vector is always perpendicular to the radius** — it points *along* the circle, not toward the centre.
2. **The acceleration always points toward the centre** — it's constantly pulling the ball inward.

---

## Step 3: Watch What Happens in a Short Time Interval

Imagine the ball is at position **A**, and a tiny moment later — call it $\Delta t$ — it's at position **B**.

<div class="fig-wrap">
<!--
  FIGURE 2: 500×480 canvas.
  Centre O at (380, 415). Orbit radius 270.
  Ball A: angle 210° (measuring CW from up in SVG, which is standard angle 210° from +x-axis in math)
    In SVG: x = 380 + 270*cos(210°) = 380 - 234 = 146; y = 415 + 270*sin(210°) = 415 - 135 = 280
    cos(210°) = -√3/2 ≈ -0.866; sin(210°) ≈ -0.5
    A = (380-234, 415-135) = (146, 280)
  Ball B: angle 290° from +x:
    cos(290°) ≈ 0.342; sin(290°) ≈ -0.940
    B = (380+92, 415-254) = (472, 161) — too far right, use 280°
    cos(280°) ≈ 0.174; sin(280°) ≈ -0.985
    B = (380+47, 415-266) = (427, 149) — still far right. Use 260°:
    cos(260°) ≈ -0.174; sin(260°) ≈ -0.985
    B = (380-47, 415-266) = (333, 149)
  
  Tangent at A: perpendicular to OA direction.
    OA direction unit: (146-380, 280-415)/270 = (-234/270, -135/270) = (-0.867, -0.5)
    Tangent CCW (rotate 90° CCW = (-y, x)): (0.5, -0.867). So tangent points up-right.
    v1 at A length 90: tip = (146+45, 280-78) = (191, 202)
  
  Tangent at B: OB unit: (333-380, 149-415)/270 = (-47/270, -266/270) = (-0.174, -0.985)
    Tangent CCW: (0.985, -0.174). Points right-slightly-down wait... in SVG y is down.
    Actually for CCW motion on screen (which appears CW in standard math), tangent = (sin(θ), -cos(θ)) where θ is angle from +x.
    At A: θ=210°. Tangent = (sin210, -cos210) = (-0.5, 0.866). In SVG (x right, y down): (-0.5, 0.866) points left-down. That's wrong for CCW.
    For CW motion (ball going clockwise visually, which is CCW in math): tangent = (-sin(θ), cos(θ))
    At A (θ=210°): (-sin210, cos210) = (0.5, -0.866) → (right, up) in SVG. Makes sense for CW orbit going from A to B.
    v1 tip: (146 + 0.5*90, 280 + (-0.866)*90) = (191, 202) ✓
    At B (θ=260°): (-sin260, cos260) = (0.985, -0.174) → (right, slightly up). 
    v2 tip: (333 + 0.985*90, 149 + (-0.174)*90) = (422, 133)
-->
<svg viewBox="0 0 500 480" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:500px;display:block;margin:0 auto;">
  <defs>
    <radialGradient id="g2b" cx="35%" cy="25%" r="65%">
      <stop offset="0%" stop-color="#dbeafe"/>
      <stop offset="40%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1e3a8a"/>
    </radialGradient>
    <marker id="g2v" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
      <polygon points="0 0, 10 4, 0 8" fill="#a78bfa"/>
    </marker>
    <marker id="g2arc" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
      <polygon points="0 0, 10 4, 0 8" fill="#10b981"/>
    </marker>
  </defs>

  <!-- faint full orbit (partial) -->
  <path d="M 146,280 A 270,270 0 0,1 333,149" fill="none" stroke="#1e293b" stroke-width="1.5" stroke-dasharray="9,6"/>
  <!-- extend the arc hint to show it's a circle -->
  <path d="M 110,248 A 270,270 0 0,0 110,248" fill="none"/>

  <!-- centre O -->
  <circle cx="380" cy="415" r="5" fill="#64748b"/>
  <text x="390" y="421" font-size="20" font-family="Georgia,'Times New Roman',serif" font-style="italic" fill="#94a3b8">O</text>

  <!-- radius OA -->
  <line x1="380" y1="415" x2="164" y2="287" stroke="#475569" stroke-width="1.8" stroke-dasharray="7,5"/>
  <text x="248" y="378" font-size="19" font-family="Georgia,'Times New Roman',serif" font-style="italic" fill="#64748b">r</text>

  <!-- radius OB -->
  <line x1="380" y1="415" x2="337" y2="168" stroke="#475569" stroke-width="1.8" stroke-dasharray="7,5"/>
  <text x="370" y="290" font-size="19" font-family="Georgia,'Times New Roman',serif" font-style="italic" fill="#64748b">r</text>

  <!-- angle arc Δθ at O -->
  <!-- From O, OA direction angle in SVG: atan2(280-415, 146-380) = atan2(-135,-234) ≈ 210° from +x -->
  <!-- OB direction: atan2(149-415, 333-380) = atan2(-266,-47) ≈ 260° from +x  -->
  <!-- Draw arc at radius 50 from O -->
  <!-- Approximate arc from (380+50*cos210, 415+50*sin210) to (380+50*cos260, 415+50*sin260) -->
  <!-- cos210=-0.866, sin210=-0.5: (380-43, 415-25) = (337, 390) -->
  <!-- cos260=-0.174, sin260=-0.985: (380-9, 415-49) = (371, 366) -->
  <path d="M 337,390 A 50,50 0 0,1 371,366" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
  <text x="340" y="372" font-size="18" font-family="Georgia,'Times New Roman',serif" font-style="italic" fill="#f59e0b">Δθ</text>

  <!-- arc Δs from A to B (green) -->
  <path d="M 146,280 A 270,270 0 0,1 333,149" fill="none" stroke="#10b981" stroke-width="4.5" stroke-linecap="round"/>
  <!-- arc label at midpoint: approx (200, 190) -->
  <text x="155" y="198" font-size="17" font-family="Georgia,'Times New Roman',serif" font-style="italic" fill="#10b981">Δs = v · Δt</text>

  <!-- Ball A -->
  <circle cx="146" cy="280" r="20" fill="url(#g2b)" stroke="#93c5fd" stroke-width="1.5"/>
  <text x="108" y="275" font-size="22" font-family="Georgia,'Times New Roman',serif" font-weight="bold" fill="#e0f2fe">A</text>

  <!-- velocity v₁ at A: direction (0.5, -0.866), length 90 → tip at (191, 202) -->
  <line x1="146" y1="280" x2="188" y2="205" stroke="#a78bfa" stroke-width="3" marker-end="url(#g2v)"/>
  <text x="192" y="200" font-size="18" font-family="Georgia,'Times New Roman',serif" font-style="italic" fill="#a78bfa">v₁</text>

  <!-- Ball B -->
  <circle cx="333" cy="149" r="20" fill="url(#g2b)" stroke="#93c5fd" stroke-width="1.5"/>
  <text x="348" y="145" font-size="22" font-family="Georgia,'Times New Roman',serif" font-weight="bold" fill="#e0f2fe">B</text>

  <!-- velocity v₂ at B: direction (0.985, -0.174), length 90 → tip at (422, 133) -->
  <line x1="333" y1="149" x2="419" y2="134" stroke="#a78bfa" stroke-width="3" marker-end="url(#g2v)"/>
  <text x="423" y="130" font-size="18" font-family="Georgia,'Times New Roman',serif" font-style="italic" fill="#a78bfa">v₂</text>

  <!-- right-angle mark at A (v₁ ⊥ OA): OA unit ≈ (-0.866, -0.5), tangent ≈ (0.5, -0.866) -->
  <!-- Corner at A offset 14px in OA direction: (146-12, 280-7) = (134, 273) -->
  <!-- then add tangent: (134+7, 273-12) = (141, 261), then back to tangent from A: (146+7, 280-12)=(153,268) -->
  <path d="M 134,273 L 141,261 L 153,268" fill="none" stroke="#475569" stroke-width="1.5"/>
</svg>
<p class="fig-caption"><strong>Figure 2.</strong> In time $\Delta t$, the ball moves from <strong>A</strong> to <strong>B</strong>. The arc length $\Delta s = v\,\Delta t$ and the central angle swept is $\Delta\theta$, giving $\Delta\theta = \Delta s/r$. The small square at A indicates $v_1 \perp r$.</p>
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
<!--
  FIGURE 3 v4: 500×400px canvas. Symmetric velocity fan.
  Tail at centre-bottom: (250, 330). Δθ = 50° total, split ±25° from vertical.
  Both vectors length 210px and fan upward symmetrically.
  v₁: angle = 270°-25° = 245° from +x (screen coords, going up-left) — no, easier:
  Let's point v₁ toward upper-right at angle 25° right of vertical (i.e. 65° from +x)
    tip₁: (250 + 210*cos65, 330 - 210*sin65) = (250+89, 330-190) = (339, 140)
  v₂: angle 25° left of vertical (i.e. 115° from +x equiv to 25° above horizontal going left NO)
  Actually: let's be simpler. Fan vectors symmetrically upward.
  v₁ at 55° from +x (going upper-right): tip (250+210*cos55, 330-210*sin55) = (250+120, 330-172) = (370, 158)
  v₂ at 125° from +x (going upper-left): tip (250+210*cos125, 330-210*sin125) = (250-120, 330-172) = (130, 158)
  Δv vector: from tip of v₁ (370,158) to tip of v₂ (130,158) — purely leftward.
  Angle between v₁ and v₂ = 125°-55° = 70° — too large.
  
  Better: use 40° between them, centered on vertical (straight up).
  v₁ at 70° from +x: tip (250+210*cos70, 330-210*sin70) = (250+72, 330-197) = (322, 133)
  v₂ at 110° from +x: tip (250+210*cos110, 330-210*sin110) = (250-72, 330-197) = (178, 133)
  Δv: from (322, 133) to (178, 133) — horizontal, length=144.
  
  This is elegant: the triangle is isoceles, Δv is horizontal, both vectors point upward.
  Angle arc at tail between v₁ (70° from +x) and v₂ (110° from +x).
-->
<svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:500px;display:block;margin:0 auto;">
  <defs>
    <marker id="g3v1" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
      <polygon points="0 0, 10 4, 0 8" fill="#a78bfa"/>
    </marker>
    <marker id="g3v2" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
      <polygon points="0 0, 10 4, 0 8" fill="#f59e0b"/>
    </marker>
    <marker id="g3dv" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
      <polygon points="0 0, 10 4, 0 8" fill="#ef4444"/>
    </marker>
  </defs>

  <!-- common tail: centre-bottom -->
  <circle cx="250" cy="330" r="6" fill="#64748b"/>
  <text x="254" y="355" font-size="16" font-family="Georgia,'Times New Roman',serif" fill="#64748b" text-anchor="middle">tail</text>

  <!-- v₁: 70° from +x → upper-right. tip at (322, 133) -->
  <line x1="250" y1="330" x2="310" y2="145" stroke="#a78bfa" stroke-width="5" marker-end="url(#g3v1)"/>
  <text x="322" y="130" font-size="24" font-family="Georgia,'Times New Roman',serif" font-style="italic" fill="#a78bfa">v₁</text>

  <!-- v₂: 110° from +x → upper-left. tip at (178, 133) -->
  <line x1="250" y1="330" x2="190" y2="145" stroke="#f59e0b" stroke-width="5" marker-end="url(#g3v2)"/>
  <text x="145" y="130" font-size="24" font-family="Georgia,'Times New Roman',serif" font-style="italic" fill="#f59e0b">v₂</text>

  <!-- Δv: from tip of v₁ (322,133) to tip of v₂ (178,133) — horizontal leftward, dashed -->
  <line x1="322" y1="133" x2="196" y2="133" stroke="#ef4444" stroke-width="3.5" stroke-dasharray="9,4" marker-end="url(#g3dv)"/>
  <text x="237" y="118" font-size="22" font-family="Georgia,'Times New Roman',serif" font-style="italic" fill="#ef4444" text-anchor="middle">Δv</text>

  <!-- angle arc Δθ at tail -->
  <!-- v₁ is at 70° from +x, v₂ at 110°. Arc from (250+55*cos70, 330-55*sin70) to (250+55*cos110, 330-55*sin110) -->
  <!-- cos70=0.342, sin70=0.940: (250+19, 330-52) = (269, 278) -->
  <!-- cos110=-0.342, sin110=0.940: (250-19, 330-52) = (231, 278) -->
  <path d="M 269,278 A 55,55 0 0,0 231,278" fill="none" stroke="#64748b" stroke-width="2.5" stroke-dasharray="5,3"/>
  <text x="250" y="262" font-size="18" font-family="Georgia,'Times New Roman',serif" font-style="italic" fill="#94a3b8" text-anchor="middle">Δθ</text>

  <!-- equal-length tick marks on each vector, at midpoint -->
  <!-- Midpt of v₁: (250+(310-250)/2, 330+(145-330)/2) = (280, 238). Perp to v₁ (dir=(60,-185)/~194=(0.309,-0.951)): perp=(0.951,0.309). Tick: ±8px perp -->
  <line x1="273" y1="244" x2="280" y2="222" stroke="#64748b" stroke-width="2.5"/>
  <!-- Midpt of v₂: (220, 238). Perp to v₂ (dir=(-60,-185)/~194=(-0.309,-0.951)): perp=(-0.951,0.309). Tick: ±8px -->
  <line x1="227" y1="244" x2="220" y2="222" stroke="#64748b" stroke-width="2.5"/>

  <!-- faint arc showing tips trace a circle centred at tail -->
  <path d="M 322,133 A 210,210 0 0,1 178,133" fill="none" stroke="#1e293b" stroke-width="1" stroke-dasharray="3,7"/>

  <!-- label: |v₁| = |v₂| = v -->
  <text x="42" y="62" font-size="17" font-family="Georgia,'Times New Roman',serif" fill="#94a3b8">|<tspan font-style="italic">v₁</tspan>| = |<tspan font-style="italic">v₂</tspan>| = <tspan font-style="italic">v</tspan></text>
  <text x="42" y="83" font-size="14" font-family="Georgia,'Times New Roman',serif" fill="#64748b">(speed constant, only direction changes)</text>

  <!-- key result -->
  <text x="250" y="390" text-anchor="middle" font-size="15" font-family="Georgia,'Times New Roman',serif" fill="#64748b">For small Δθ: |Δv| ≈ <tspan font-style="italic">v</tspan> · Δθ</text>
</svg>
<p class="fig-caption"><strong>Figure 3.</strong> With $\mathbf{v}_1$ and $\mathbf{v}_2$ placed tail-to-tail, the angle between them is $\Delta\theta$ (same as the angle swept by the position vector). Tick marks show $|v_1| = |v_2| = v$. The chord $\Delta\mathbf{v}$ (red) satisfies $|\Delta v| \approx v\,\Delta\theta$ for small $\Delta\theta$.</p>
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
