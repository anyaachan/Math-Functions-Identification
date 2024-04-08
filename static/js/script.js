
function pauseOn() {
    document.getElementById('pause-screen').style.display = 'block';
}

function pauseOff() {
    document.getElementById('pause-screen').style.display = 'none';
}

function toMenu() {
    window.location.href="/";
}

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
    let drawing_count = 0;

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

    // Variables to determine the line width
    const nativeRes = 256; // Resolution of training data
    const lineWidth = 3; // Width of the line in the training data

    // Set dynamic line width
    var actualLineWidth = lineWidth * (canvas.width / nativeRes);

    // Set the stroke style
    ctx.lineWidth = actualLineWidth;
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

    function getCanvasContent () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#000000';
        ctx.stroke(path);

        let canvasURL = canvas.toDataURL();
        const downloadElement = document.createElement('a');
        downloadElement.href = canvasURL;
                
        // This is the name of our downloaded file
        downloadElement.download = "download-this-canvas";

        downloadElement.click();
        downloadElement.remove();
    }

    function sendCanvasToServer() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#000000';
        ctx.stroke(path);

        const canvasURL = canvas.toDataURL('image/png');
        
        // Function to make HTTP request
        fetch('/upload-image', { // Flask reference, where to send the request
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Signify that the request is a Json 
            },
            body: JSON.stringify({ image: canvasURL }) // The content being send to server. 
            // Convert image into JSON string
        })
        .then(response => response.json()) // Recieve raw responce from the server, also returns a promise
        .then(data => {  // Process the response data, eg showing the result to the user
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    // Stop drawing when mouse is released
    canvas.onmouseup = () => {
        drawing = false;
        getCanvasContent();
    }

    canvas.onmouseleave = (e) => {
        if(drawing) {
            drawing = false;

            const {x, y} = getEventCanvasPosition(e);
            path.lineTo(x, y);
            ctx.stroke(path);

            getCanvasContent();
        }
    }
});
