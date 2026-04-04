// shapes.js

const shapeCenter = { x: 250, y: 250 };
const shapeRadius = 100;

// Utility: generate interpolated points between two points
function interpolatePoints(p1, p2, steps = 50) {
  const points = [];
  for (let s = 0; s <= steps; s++) {
    points.push({
      x: p1.x + (p2.x - p1.x) * (s / steps),
      y: p1.y + (p2.y - p1.y) * (s / steps),
      hit: false
    });
  }
  return points;
}

// --- Seeded random function ---
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// --- Random polygon (deterministic based on seed) ---
function randomPolygon(sides = 6, seed = 1) {
  const vertices = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * 2 * Math.PI;
    const r = shapeRadius * (0.5 + seededRandom(seed + i) * 0.5); // 50-100% radius
    vertices.push({
      x: shapeCenter.x + r * Math.cos(angle),
      y: shapeCenter.y + r * Math.sin(angle)
    });
  }
  const shape = [];
  for (let i = 0; i < vertices.length; i++) {
    const next = vertices[(i + 1) % vertices.length];
    shape.push(...interpolatePoints(vertices[i], next, 50));
  }
  return shape.map(p => ({ ...p, hit: false }));
}

// --- Circle shape ---
const circleShape = [];
const numCirclePoints = 200;
for (let i = 0; i < numCirclePoints; i++) {
  const angle = (i / numCirclePoints) * 2 * Math.PI;
  circleShape.push({
    x: shapeCenter.x + shapeRadius * Math.cos(angle),
    y: shapeCenter.y + shapeRadius * Math.sin(angle),
    hit: false
  });
}

// --- Triangle shape ---
const triangleVertices = [
  { x: 250, y: 150 },
  { x: 350, y: 350 },
  { x: 150, y: 350 }
];
const triangleShape = [];
for (let i = 0; i < triangleVertices.length; i++) {
  const next = triangleVertices[(i + 1) % triangleVertices.length];
  triangleShape.push(...interpolatePoints(triangleVertices[i], next, 70));
}

function wavyCircle(waves = 6, seed = 1) {
  const points = [];
  const total = 200;

  for (let i = 0; i < total; i++) {
    const angle = (i / total) * 2 * Math.PI;

    const wave = Math.sin(angle * waves + seed) * 20;
    const r = shapeRadius + wave;

    points.push({
      x: shapeCenter.x + r * Math.cos(angle),
      y: shapeCenter.y + r * Math.sin(angle),
      hit: false
    });
  }

  return points;
}

function boldAndBrashShape(seed = 1) {
  const points = [];
  const total = 220;

  for (let i = 0; i < total; i++) {
    const t = i / total * 2 * Math.PI;

    // base shape = squished oval
    let x = Math.cos(t);
    let y = Math.sin(t) * 0.7;

    // add chaotic distortion
    const noise =
      Math.sin(t * 3 + seed) * 0.2 +
      Math.sin(t * 7 + seed * 2) * 0.1;

    const r = shapeRadius * (1 + noise);

    points.push({
      x: shapeCenter.x + x * r,
      y: shapeCenter.y + y * r,
      hit: false
    });
  }

  return points;
}



// --- Daily polygons ---
const today = new Date().getDate();
const polygonShape1 = randomPolygon(5, today);
const polygonShape2 = randomPolygon(7, today + 1);
const polygonShape3 = randomPolygon(8, today + 2);
const wavyShape = wavyCircle(6, today);
const boldShape = boldAndBrashShape(today);

// --- All shapes array ---
const shapes = [circleShape, triangleShape, polygonShape1, polygonShape2, polygonShape3, wavyShape, boldShape];

// --- Function to get today's shape ---
function getTodaysShape() {
  const day = new Date().getDate();
  return shapes[day % shapes.length];
}