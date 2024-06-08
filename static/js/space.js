const canvas = document.getElementById("spaceCanvas")
canvas.oncontextmenu = () => {return false;}
canvas.style.zIndex = "-10"

const ctx = canvas.getContext('2d');
// Set canvas to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Starfield settings
const numStars = 1500;
const starSpeed = 2;
const starRadius = 2;
const focusPointRadius = 0; // Shows where the cursor is right now for debugging purposes
const starFollowFactor = 0.1;

// Mouse/focus point settings
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let focusX = mouseX;
let focusY = mouseY;
let inertiaX = 0;
let inertiaY = 0;
const inertiaFactor = 0.9; // Higher value for more inertia
const dampingFactor = .99; // Lower value for more damping

// Field of view and perspective
const fov = 5000;  // Adjust this to control how much of the starfield is visible
const zMax = fov; // Maximum Z value for stars
const fieldMargin = 0.05; // Add a 10% margin to the field of view

// Create stars array with expanded positions and margin
const stars = [];
for (let i = 0; i < numStars; i++) {
  stars.push({
    x: (Math.random() - 0.5) * fov * (1 + fieldMargin), // Centered with margin
    y: (Math.random() - 0.5) * fov * (1 + fieldMargin),
    z: Math.random() * zMax,
  });
}


// Animation loop
function animate() {
  // Clear the canvas
  ctx.fillStyle = "black";
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update focus point with inertia
  inertiaX = (inertiaX + (mouseX - focusX)) * inertiaFactor;
  inertiaY = (inertiaY + (mouseY - focusY)) * inertiaFactor;
  focusX += inertiaX * (1 - dampingFactor); // Apply damping
  focusY += inertiaY * (1 - dampingFactor);

  // Draw stars
  for (const star of stars) {
    star.z -= starSpeed;
    if (star.z < 1) {
      star.x = (Math.random() - 0.5) * fov * (1 + fieldMargin);
      star.y = (Math.random() - 0.5) * fov * (1 + fieldMargin);
      star.z = zMax;
    }

    // Calculate 3D to 2D projection (adjusted for margin and follow factor)
    const scale = canvas.width / star.z;
    const offsetX = focusX * scale * starFollowFactor; // Adjusted offset
    const offsetY = focusY * scale * starFollowFactor;
    const x = star.x * scale + canvas.width / 2 - offsetX;
    const y = star.y * scale + canvas.height / 2 - offsetY;

    // Draw star
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y, starRadius * scale, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Draw focus point (cursor)
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(focusX, focusY, focusPointRadius, 0, 2 * Math.PI);
  ctx.fill();

  requestAnimationFrame(animate);
}

// Event listeners for mouse movement
canvas.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

// Start the animation
animate();