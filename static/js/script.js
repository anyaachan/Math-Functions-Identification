document.addEventListener('DOMContentLoaded', (event) => {
    // Reference to the canvas and div element
    const canvas = document.getElementById('canvas-drawing');
    const graphDrawingDiv = document.getElementById('graph-drawing');

    // Get the drawing context of the canvas object. 2d as a parameter means 2D drawing
    // Canvas API of HTML5
    const ctx = canvas.getContext('2d');

    // Adjust canvas size to fill its container
    canvas.width = graphDrawingDiv.offsetWidth;
    canvas.height = graphDrawingDiv.offsetHeight;

    // Variable to define whether the user is drawing
    let drawing = false;

    // Function to calculate the accurate position of touch events relative to canvas and css styling
    function getEventCanvasPosition(e) {
        // Get dimensions of the canvas and position relative to the viewport
        const rect = canvas.getBoundingClientRect();

        // Get ratio of the canvas buffer size to the element size. 
        // Buffer Size - actual drawing area in pixels
        // Element size - physical size of the element as specified in the css -> displayed on the screem
        const scaleX = canvas.width / rect.width; 
        const scaleY = canvas.height / rect.height; 

        // Return accurate mouse coordinates even when canvas is resized. 
        return {
            // Scale coordinates
            x: (e.clientX - rect.left) * scaleX, 
            y: (e.clientY - rect.top) * scaleY  
        }
    }

    // Initiate drawing when mouse is pressed
    canvas.onmousedown = (e) => {
        drawing = true;

        // Define coordinates of the start position
        const {x, y} = getEventCanvasPosition(e);

        // Signals to start the new path on <canvas> element
        ctx.beginPath();

        // Set drawing cursor to the start position
        ctx.moveTo(x, y);
    }

    // Draw on canvas as the mouse is moved
    canvas.onmousemove = (e) => {
        // If the mouse is pressed, draw
        if (drawing) {
            const {x, y} = getEventCanvasPosition(e);
            // Draw a line by connecting the last point in the current path to the x, y coordinates
            ctx.lineTo(x, y);
            // Visually render the path on the canvas with the specified stroke style
            ctx.stroke();
        }
    }

    // Stop drawing when mouse is released or cursor leaves canvas area
    canvas.onmouseup = () => {
        drawing = false;
    }

    canvas.onmouseleave = () => {
        drawing = false;
    }
});
