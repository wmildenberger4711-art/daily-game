Cool Cutters Game – Summary
===========================

1. index.html
-------------
Purpose:
- The main HTML page that holds the game canvas, score display, timer, and includes CSS and JS files.

Structure:

<!DOCTYPE html>
<html>
<head>
  <title>Cool Cutters Daily Game</title>
  <link rel="stylesheet" href="style.css">  <!-- Main style -->
</head>
<body>
  <canvas id="gameCanvas" width="500" height="500"></canvas>
  <div id="score">Score: 0</div>
  <div id="timer">Time: 7s</div>

  <!-- Scripts -->
  <script src="shapes.js"></script>  <!-- Defines shapes -->
  <script src="main.js"></script>    <!-- Main game logic -->
</body>
</html>

Notes:
- `shapes.js` must be included before `main.js`.
- The canvas element is where the player draws.
- `#score` shows current score and highscore.
- `#timer` shows remaining time for the round.

---

2. style.css
------------
Purpose:
- Defines visual style for canvas and text.

Example:

canvas {
  border: 2px solid black;
  display: block;
  margin: 20px auto;
}

#score, #timer {
  text-align: center;
  font-size: 20px;
  margin-top: 5px;
}

Notes:
- Canvas border shows game boundaries.
- Text is centered and readable.

---

3. shapes.js
------------
Purpose:
- Defines all the shapes that can be drawn in the game.
- Each shape is an array of points along the perimeter.
- Points must be in order to track completion.

Example:

// Circle shape
const circleShape = [];
const shapeCenter = { x: 250, y: 250 };
const shapeRadius = 100;
const numPoints = 200;

for(let i = 0; i < numPoints; i++) {
  const angle = (i / numPoints) * 2 * Math.PI;
  circleShape.push({ x: shapeCenter.x + shapeRadius * Math.cos(angle),
                     y: shapeCenter.y + shapeRadius * Math.sin(angle),
                     hit: false });
}

// Triangle shape (interpolated edges)
const triangleShape = [
  {x: 250, y: 150},
  {x: 350, y: 350},
  {x: 150, y: 350}
].flatMap((p, i, arr) => {
  const next = arr[(i+1)%arr.length];
  const steps = 70;
  const points = [];
  for(let s = 0; s <= steps; s++) {
    points.push({
      x: p.x + (next.x - p.x) * (s / steps),
      y: p.y + (next.y - p.y) * (s / steps),
      hit: false
    });
  }
  return points;
});

// Add all shapes here
const shapes = [circleShape, triangleShape];

// Get daily shape based on date
function getTodaysShape() {
  const day = new Date().getDate();
  return shapes[day % shapes.length]; 
}

Notes:
- `hit` property tracks which points were touched.
- Daily shape automatically selected.
- Add more shapes by defining arrays of points.

---

4. main.js
----------
Purpose:
- Main game logic: drawing, input, scoring, timer.

Key Parts:

Initialize Canvas & Start Point:
--------------------------------
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
let startPoint = { x: 350, y: 250 };
let startRadius = 7;

Draw Shape & Start Point:
-------------------------
function drawShape() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(shapePoints[0].x, shapePoints[0].y);
  for (let i = 1; i < shapePoints.length; i++) {
    ctx.lineTo(shapePoints[i].x, shapePoints[i].y);
  }
  ctx.closePath();
  ctx.stroke();

  ctx.fillStyle = 'green';
  ctx.beginPath();
  ctx.arc(startPoint.x, startPoint.y, startRadius, 0, 2 * Math.PI);
  ctx.fill();
}

Mouse Events:
-------------
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', drawUserLine);

function startDrawing(e) {
  if (mouseNearStart(e)) {
    drawing = true;
    userPath = [{x: e.offsetX, y: e.offsetY}];
    resetShapeHits();
    startTimer();
  }
}

function drawUserLine(e) {
  if (!drawing) return;
  userPath.push({x: e.offsetX, y: e.offsetY});
  markNearestShapePoint(e);
  drawGradientLine(e);
  checkIfReturnedToStart(e);
}

Score Calculation:
------------------
function calculateScore() {
  const hits = shapePoints.filter(p => p.hit).length;
  const total = shapePoints.length;
  const finalScore = Math.round((hits / total) * 100);

  const highscore = localStorage.getItem('coolCuttersHigh') || 0;
  if(finalScore > highscore) localStorage.setItem('coolCuttersHigh', finalScore);

  document.getElementById('score').innerText =
    `Score: ${finalScore} | Highscore: ${Math.max(finalScore, highscore)}`;
}

Timer:
------
- Controlled via `timeLimit` (seconds).
- Counts down once drawing starts.
- Ends game automatically if time runs out.

Gradient Line:
--------------
- Line color changes from green (perfect) to red (off-shape).
- Subtle glow when very close to perfect.

---

5. Features So Far
-----------------
- Rounded lines and smooth drawing.
- Start point must be clicked to begin.
- Gradient line for precision feedback.
- Glow when very close.
- Timer per round.
- Daily shape selection.
- Score = % of shape covered.
- Highscore saved in local storage.
- Multiple shapes supported.

---

6. Adding New Shapes
--------------------
1. Define points along the perimeter in `shapes.js`.
2. Interpolate edges for smooth coverage.
3. Add shape to `shapes` array.
4. Daily shape selection auto-updates.

---

7. Future Enhancements
----------------------
- Share results button/UI.
- Adjustable time per shape.
- Wordle-style grid/UI.
- Complex freeform shapes like stars or polygons.
