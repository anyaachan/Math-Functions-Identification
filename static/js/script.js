document.addEventListener('DOMContentLoaded', (event) => {

const canvas = document.getElementById('canvas-drawing');
// canvas is an object that provides methods and properties to draw on the canvas.
const ctx = canvas.getContext('2d');

let drawing = false; // variable to indicate whether the user is drawing
// storing last known positions of the users touch
let lastX = 0;
let lastY = 0;

// Function to start the drawing process.
function startDrawing(e) {
    drawing = true; // Indicate drawing has started. 

    // Initialize lastX and lastY with the current mouse or touch position.
    [lastX, lastY] = [e.offsetX || e.touches[0].clientX - canvas.offsetLeft, e.offsetY || e.touches[0].clientY - canvas.offsetTop];
}


// Triggered by mouse movement or touch movement on the canvas. It's responsible for the drawing action.
function draw(e) {
    if (!drawing) return; // If the user is not drawing, exit the function and do nothing.
    e.preventDefault(); // Prevents default touch actions like scrolling or zooming on touch devices, allowing for smoother drawing.
    // Determine the current position for drawing. It needs to account for touch events similarly to 'startDrawing'.
    const X = e.offsetX || e.touches[0].clientX - canvas.offsetLeft;
    const Y = e.offsetY || e.touches[0].clientY - canvas.offsetTop;

    ctx.beginPath(); // Start a new path in the canvas drawing context. This is necessary to begin drawing.
    ctx.moveTo(lastX, lastY); // Move the drawing cursor to the last recorded position without drawing a line.
    ctx.lineTo(X, Y); // Draw a line from the last position to the current position.
    ctx.stroke(); // Renders the path visible using the current stroke style (color, width, etc.).

    // Update 'lastX' and 'lastY' with the current position so that the next 'draw' operation starts from here.
    [lastX, lastY] = [X, Y];
}

// Called when the user stops drawing, either by releasing the mouse button or lifting the finger off the screen.
function stopDrawing() {
    drawing = false; // Reset the drawing flag since the drawing action has ended.
}

// Attach event listeners to the canvas for mouse actions. These listen for the start, continue, and end of a drawing action.
canvas.addEventListener('mousedown', startDrawing); // Begin drawing when the mouse button is pressed down.
canvas.addEventListener('mousemove', draw); // Continue drawing as the mouse moves.
canvas.addEventListener('mouseup', stopDrawing); // End drawing when the mouse button is released.
canvas.addEventListener('mouseout', stopDrawing); // Also end drawing if the cursor leaves the canvas area.

// Similarly, attach event listeners for touch actions to support drawing on touch devices.
canvas.addEventListener('touchstart', startDrawing); // Begin drawing on touch start.
canvas.addEventListener('touchmove', draw); // Continue drawing as the touch moves.
canvas.addEventListener('touchend', stopDrawing); // End drawing when the touch is lifted.


ctx.strokeStyle = '#000'; // Line color
ctx.lineWidth = 2;        // Line width
ctx.lineJoin = 'round';   // Line join style
ctx.lineCap = 'round';    // Line cap style
});
