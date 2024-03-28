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
        // Element size - physical size of the element as specified in the css -> displayed on the screen
        const scaleX = canvas.width / rect.width; 
        const scaleY = canvas.height / rect.height; 

        // Return accurate mouse coordinates even when canvas is resized. 
        return {
            // Scale coordinates
            x: (e.clientX - rect.left) * scaleX, 
            y: (e.clientY - rect.top) * scaleY  
        }
    }

    // Set the stroke style
    ctx.lineWidth = 8;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#B70000';

    // Initiate drawing when mouse is pressed
    canvas.onmousedown = (e) => {
        drawing = true;

        // Define coordinates of the start position
        const {x, y} = getEventCanvasPosition(e);
        
        // Set drawing cursor to the start position
        path.moveTo(x, y);
        path.lineTo(x, y);
        ctx.stroke(path);
        lastX = x;
        lastY = y;
    }

    // Draw on canvas as the mouse is moved
    canvas.onmousemove = (e) => {
        // If the mouse is pressed, draw
        if (drawing) {
            const {x, y} = getEventCanvasPosition(e);

            // Calculate the midpoint between the last point and the current point
            let midX = (lastX + x) / 2;
            let midY = (lastY + y) / 2;

            path.quadraticCurveTo(lastX, lastY, midX, midY);

            // Visually render the path on the canvas with the specified stroke style
            ctx.stroke(path);

            lastX = x;
            lastY = y;
        }
    }

    // Stop drawing when mouse is released
    canvas.onmouseup = () => {
        drawing = false;
    }

    canvas.onmouseleave = (e) => {
        if(drawing) {
            drawing = false;

            const {x, y} = getEventCanvasPosition(e);
            path.lineTo(x, y);
            ctx.stroke(path);
        }
    }


});
