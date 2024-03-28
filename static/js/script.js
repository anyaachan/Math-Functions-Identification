document.addEventListener('DOMContentLoaded', (event) => {
    // Reference to the canvas and div element
    const canvas = document.getElementById('canvas-drawing');
    const graphDrawingDiv = document.getElementById('graph-drawing');

    // Get the drawing context of the canvas object. 2d as a parameter means 2D drawing
    // Canvas API of HTML5 (a way to inrteract with canvas)
    const ctx = canvas.getContext('2d');
    const path = new Path2D();

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
        
        // Set drawing cursor to the start position
        path.moveTo(x, y);
    }

    const lastX = 0;
    const lastY = 0;
    
    // Draw on canvas as the mouse is moved
    canvas.onmousemove = (e) => {
        // If the mouse is pressed, draw
        if (drawing) {
            const {x, y} = getEventCanvasPosition(e);

            // Set the stroke style for the path
            ctx.lineWidth = 8;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            // Draw a line by connecting the last point in the current path to the x, y coordinates
            path.quadraticCurveTo(x, y, x, y);

            // Visually render the path on the canvas with the specified stroke style
            ctx.stroke(path);
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
