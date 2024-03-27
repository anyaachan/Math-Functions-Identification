document.addEventListener('DOMContentLoaded', (event) => {
    // Reference to the canvas and div element
    const canvas = document.getElementById('canvas-drawing');
    const graphDrawingDiv = document.getElementById('graph-drawing');

    // Get the drawing context of the canvas object. 2d as a parameter means 2D drawing
    const ctx = canvas.getContext('2d');

    // Adjust canvas size to fill its container
    canvas.width = graphDrawingDiv.offsetWidth;
    canvas.height = graphDrawingDiv.offsetHeight;

    // Variable to define whether the user is drawing
    let drawing = false;

    function getEventCanvasPosition(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width; // Relationship bitmap vs. element for X
        const scaleY = canvas.height / rect.height; // Relationship bitmap vs. element for Y

        return {
            x: (e.clientX - rect.left) * scaleX, // Scale mouse coordinates after they have
            y: (e.clientY - rect.top) * scaleY   // been adjusted to be relative to element
        }
    }

    canvas.onmousedown = (e) => {
        drawing = true;
        const {x, y} = getEventCanvasPosition(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    canvas.onmousemove = (e) => {
        if (drawing) {
            const {x, y} = getEventCanvasPosition(e);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }

    canvas.onmouseup = () => {
        drawing = false;
    }

    canvas.onmouseleave = () => {
        drawing = false;
    }

    // Support for touch devices
    canvas.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);

    canvas.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);

    canvas.addEventListener('touchend', (e) => {
        const mouseEvent = new MouseEvent("mouseup", {});
        canvas.dispatchEvent(mouseEvent);
    }, false);

    // Prevent scrolling when touching the canvas
    document.body.addEventListener("touchstart", (e) => {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, { passive: false });
    document.body.addEventListener("touchend", (e) => {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, { passive: false });
    document.body.addEventListener("touchmove", (e) => {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, { passive: false });

});
