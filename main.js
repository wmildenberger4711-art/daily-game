// main.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// make lines rounded
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// Track drawing
let drawing = false;
let userPath = [];

// Timer
let timeLimit = 10;
let timeLeft = timeLimit;
let timerInterval = null;

// Get today's shape points from shapes.js
const shapePoints = getTodaysShape();
let startPoint = {x: shapePoints[0].x, y:shapePoints[0].y };
let startRadius = 7;

// --- Lofi dust particles ---
const particles = [];
const numParticles = 80;

// initialize particles
for (let i = 0; i < numParticles; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 0.5,
    alpha: Math.random() * 0.25 + 0.05,
    speedX: (Math.random() - 0.5) * 0.15,
    speedY: (Math.random() - 0.5) * 0.15,
    drift: Math.random() * 0.5
  });
}


// --- Start point pastel color ---
let startHue = Math.random() * 360;

// Draw shape and start point
function drawShape() {

  // draw outline using shape points
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(shapePoints[0].x, shapePoints[0].y);
  for (let i = 1; i < shapePoints.length; i++) {
    ctx.lineTo(shapePoints[i].x, shapePoints[i].y);
  }
  ctx.closePath();
  ctx.stroke();

  // draw start point
  ctx.fillStyle = '#cda4ff';
  ctx.beginPath();
  ctx.arc(startPoint.x, startPoint.y, startRadius, 0, 2 * Math.PI);
  ctx.fill();
}

// Initial draw
drawShape();

// --- Mouse events ---
canvas.addEventListener('mousedown', e => {
  const dx = e.offsetX - startPoint.x;
  const dy = e.offsetY - startPoint.y;
  const dist = Math.sqrt(dx*dx + dy*dy);

  if (dist < startRadius) {
    drawing = true;
    userPath = [{ x: e.offsetX, y: e.offsetY }];

    // reset hit flags on shape points
    for (let p of shapePoints) p.hit = false;

    // start timer
    timeLeft = timeLimit;
    document.getElementById('timer').innerText = `Time: ${timeLeft}s`;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      document.getElementById('timer').innerText = `Time: ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        drawing = false;
        calculateScore();
      }
    }, 1000);

    drawShape();
  }
});

canvas.addEventListener('mousemove', e => {
  if (!drawing) return;

  userPath.push({ x: e.offsetX, y: e.offsetY });

  // Find nearest edge point to current mouse pos
  let minDist = Infinity;
  let nearest = null;
  for (let p of shapePoints) {
    const dx = e.offsetX - p.x;
    const dy = e.offsetY - p.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < minDist) {
      minDist = dist;
      nearest = p;
    }
  }
  const maxHitDistance = 3.2;  // smaller value = stricter scoring
  if (nearest && minDist < maxHitDistance) {
  nearest.hit = true;
}

  // Gradient color from green (close) to red (far)
  const maxError = 20;

  // --- Gradient color from pastel purple (good) to pastel pink (bad) ---
  // --- Gradient color from pastel pink (good) to red (bad) ---
  const t = Math.min(minDist / maxError, 1); // 0 = perfect, 1 = worst

  // Pastel pink: rgb(255, 182, 193)
  // Red: rgb(255, 0, 0)
  const r = 255; // stays full
  const g = Math.round(182 * (1 - t) + 0 * t); // 182 → 0
  const b = Math.round(193 * (1 - t) + 0 * t); // 193 → 0

  ctx.strokeStyle = `rgb(${r},${g},${b})`;
  ctx.shadowColor = t < 0.05 ? ctx.strokeStyle : 'transparent';
  ctx.shadowBlur = t < 0.05 ? 1 : 0;

  ctx.lineWidth = 6;
  ctx.beginPath();
  const prev = userPath[userPath.length-2];
  ctx.moveTo(prev.x, prev.y);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Check if back to start
  const dxStart = e.offsetX - startPoint.x;
  const dyStart = e.offsetY - startPoint.y;
  const distStart = Math.sqrt(dxStart*dxStart + dyStart*dyStart);
  if (distStart < startRadius && userPath.length > 20) {
    drawing = false;
    clearInterval(timerInterval);
    calculateScore();
  }
});

function drawDust() {
  for (let p of particles) {

    // 🌫 soft glow effect
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(
      p.x, p.y, 0,
      p.x, p.y, p.size * 4
    );
    gradient.addColorStop(0, `rgba(255,255,255,${p.alpha})`);
    gradient.addColorStop(1, `rgba(255,255,255,0)`);

    ctx.fillStyle = gradient;
    ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
    ctx.fill();

    // ✨ movement (floaty + wavy)
    p.x += p.speedX + Math.sin(Date.now() * 0.001 + p.drift) * 0.05;
    p.y += p.speedY + Math.cos(Date.now() * 0.001 + p.drift) * 0.05;

    // 🔁 wrap around edges
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
  }
}

function drawUserPath() {
  if (userPath.length < 2) return;

  for (let i = 1; i < userPath.length; i++) {
    const prev = userPath[i - 1];
    const curr = userPath[i];

    // Calculate nearest point for gradient
    let minDist = Infinity;
    let nearest = null;
    for (let p of shapePoints) {
      const dx = curr.x - p.x;
      const dy = curr.y - p.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < minDist) {
        minDist = dist;
        nearest = p;
      }
    }

    const maxError = 20;
    const t = Math.min(minDist / maxError, 1);
    const r = 255;
    const g = Math.round(182 * (1 - t) + 0 * t);
    const b = Math.round(193 * (1 - t) + 0 * t);

    ctx.strokeStyle = `rgb(${r},${g},${b})`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(curr.x, curr.y);
    ctx.stroke();
  }
}

function animate() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw everything
  drawDust();       // lofi particles
  drawShape();      // shape + start point
  drawUserPath();   // we'll move your mouse line drawing code here


  requestAnimationFrame(animate);
}

// start the loop
animate();

// --- Score calculation ---
function calculateScore() {
  const hits = shapePoints.filter(p => p.hit).length;
  const total = shapePoints.length;
  const finalScore = Math.round((hits / total) * 100);

  // Save highscore
  const highscore = localStorage.getItem('coolCuttersHigh') || 0;
  if (finalScore > highscore) localStorage.setItem('coolCuttersHigh', finalScore);

  document.getElementById('score').innerText =
    `Score: ${finalScore} | Highscore: ${Math.max(finalScore, highscore)}`;

  // Show the share button
  const shareBtn = document.getElementById('shareBtn');
  const shareMessage = document.getElementById('shareMessage');
  shareBtn.style.display = 'inline-block';
  shareMessage.innerText = '';

  // Prepare share text (simple example)
  const shareText = `Cool Cutters Daily\nScore: ${finalScore} | Highscore: ${Math.max(finalScore, highscore)}`;

  shareBtn.onclick = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      shareMessage.innerText = 'Score copied to clipboard! Share it with friends 🎉';
      setTimeout(() => { shareMessage.innerText = ''; }, 3000);
    }).catch(() => {
      shareMessage.innerText = 'Failed to copy. Please try manually.';
    });
  };
}