let duration = 20;
let heartsCount = 3;
let score = 0;

let stopwatch = 0;
var intervalID;

let nCorrectAnsw = 0;
let nIncorrectAnsw = 0;

function pauseOn() {
    document.getElementById('pause-screen').style.display = 'block';
}

function pauseOff() {
    document.getElementById('pause-screen').style.display = 'none';
    continueTimer();
}

function continueTimer() {
    if (window.location.pathname == "/eternal") {
        let currentTime = (document.getElementById("eternal-time").textContent).slice(-2);
        startStopwatch(currentTime);
    }
    if (window.location.pathname == "/arcade") {
        let currentDur = (document.getElementById("arcade-time").textContent).slice(-2);
        startTimer(currentDur);
    }
}

function displayAnswerRatio() {
    let ratio = nCorrectAnsw + "/" + (nCorrectAnsw + nIncorrectAnsw);
    document.getElementById("eternal-ratio").textContent = ratio;
}

function gameOver() {
    document.getElementById('game-over-screen').style.display = 'block';
    document.getElementById('score-info').textContent = "Score: " + score;
    score = 0;
}

function heartsDisplay(heartsCount) {
    switch (heartsCount) {
        case 1:
            document.getElementById('life1').src = "static/media/heart-filled.svg";
            document.getElementById('life2').src = "static/media/heart-empty.svg";
            document.getElementById('life3').src = "static/media/heart-empty.svg";
            break;
        case 2:
            document.getElementById('life1').src = "static/media/heart-filled.svg";
            document.getElementById('life2').src = "static/media/heart-filled.svg";
            document.getElementById('life3').src = "static/media/heart-empty.svg";
            break;
        case 3:
            document.getElementById('life1').src = "static/media/heart-filled.svg";
            document.getElementById('life2').src = "static/media/heart-filled.svg";
            document.getElementById('life3').src = "static/media/heart-filled.svg";
            break;
        case 0:
            document.getElementById('life1').src = "static/media/heart-filled.svg";
            document.getElementById('life2').src = "static/media/heart-filled.svg";
            document.getElementById('life3').src = "static/media/heart-filled.svg";
            gameOver();
    }
}

function resultOn(result) {
    document.getElementById('result-screen').style.display = 'block';
    clearInterval(intervalID);
    duration -= 1;
    if (window.location.pathname == "/arcade") {
        if (duration < 10) {
            document.getElementById('arcade-time').textContent = "00:0" + duration;
        } else {
            document.getElementById('arcade-time').textContent = "00:" + duration;
        }
    }
    if (result == true) {
        document.getElementById('correct').style.display = 'block';

        if (window.location.pathname == "/arcade") {
            let seconds_left = parseInt((document.getElementById("arcade-time").textContent).slice(-2));
            score += 2000;
            score += seconds_left * 200;
            heartsDisplay(heartsCount);
        }

        if (window.location.pathname == "/eternal") {
            nCorrectAnsw += 1;
            document.getElementById("wolfram-result").style.display = "block";
            displayAnswerRatio();
        }
    }
    else {
        document.getElementById('incorrect').style.display = 'block';
        if (window.location.pathname == "/arcade") {
            heartsCount -= 1;
            heartsDisplay(heartsCount);
            if (heartsCount == 0) {
                heartsCount = 3;
            }
        }

        if (window.location.pathname == "/eternal") {
            nIncorrectAnsw += 1;
            displayAnswerRatio();
        }
    }

}

function resultOff() {
    continueTimer();
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('correct').style.display = 'none';
    document.getElementById('incorrect').style.display = 'none';
}

function toMenu() {
    window.location.href = "/";
}

let functions = {
    "linear": "x",
    "negative_linear": "-x",
    "quadratic": "x^2",
    "negative_quadratic": "-x^2",
    "cubic": "x^3",
    "negative_cubic": "-x^3",
    "square_root": "sqrt(x)",
    "negative_square_root": "-sqrt(x)",
    "exponential": "e^x",
    "negative_exponential": "-e^x",
    "logarithmic": "log(x)",
    "square_negative_root": "sqrt(-x)",
    "absolute_linear": "|x|"
}

let functionsToLatex = {
    "x": "x",
    "-x": "-x",
    "x^2": "x^2",
    "-x^2": "-x^2",
    "x^3": "x^3",
    "-x^3": "-x^3",
    "sqrt(x)": "\\sqrt(x)",
    "-sqrt(x)": "-\\sqrt(x)",
    "sqrt(-x)": "\\sqrt(-x)",
    "e^x": "e^x",
    "-e^x": "-e^x",
    "log(x)": "\log_{e}(x)",
    "|x|": "|x|"
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function getRandomEquation() {
    const keys = Object.values(functions);
    let randomIndex = Math.floor(Math.random() * keys.length);
    let latexContent = "$$" + functionsToLatex[keys[randomIndex]] + "$$"
    let equations = document.getElementsByClassName("equation");

    for (var i = 0; i < equations.length; i++) {
        equations[i].innerHTML = latexContent;
    }

    return keys[randomIndex];
}

function checkEquation(userJson, functions, equation) {
    userAnswer = userJson.result;
    let correctAnswer = getKeyByValue(functions, equation);
    let result = (userAnswer == correctAnswer);
    console.log("userAnswer: " + userAnswer);
    console.log("correctAnswer: " + correctAnswer);
    return result;
}

function getWolframLink(equation, isEternal) {
    let wolframUrl = "https://www.wolframalpha.com/input/?i=" + encodeURIComponent(equation);
    if (isEternal) {
        let wolframResultDiv = document.getElementById("wolfram-result");
        wolframResultDiv.href = wolframUrl;
    } else {
        let wolframDiv = document.getElementById("wolfram");
        wolframDiv.href = wolframUrl;
    }
}

function startTimer(duration) {
    let timer = duration;
    var seconds;

    intervalID = setInterval(function () {
        console.log("Timer:" + timer)
        seconds = parseInt(timer, 10)
        if (seconds < 10) {
            console.log("LESS THAN 10")
            document.getElementById("arcade-time").textContent = "00:0" + seconds;
        } else {
            document.getElementById("arcade-time").textContent = "00:" + seconds;
        }
        

        timer = timer - 1;
        if (timer < 0) {
            gameOver();
            timer = duration;
            clearInterval(intervalID);
        }

    }, 1000);

    document.getElementById("pause").addEventListener("click", function () {
        clearInterval(intervalID);
    })
}

function startStopwatch(stopwatch) {
    let time = stopwatch;
    let seconds;
    let minutes;

    intervalID = setInterval(function () {
        minutes = parseInt(time / 60, 10)
        seconds = parseInt(time % 60, 10);

        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        document.getElementById("eternal-time").textContent = minutes + ":" + seconds;
        time++;
    }, 1000)

    document.getElementById("pause").addEventListener("click", function () {
        clearInterval(intervalID);
    })
}

document.addEventListener('DOMContentLoaded', (event) => {
    let randomEquation = getRandomEquation();

    if (window.location.pathname == "/arcade") {
        startTimer(duration);
    }

    if (window.location.pathname == "/eternal") {
        displayAnswerRatio();
        getWolframLink(randomEquation, true);
        startStopwatch(stopwatch);
    }

    if (window, location.pathname == "/mentor") {
        getWolframLink(randomEquation, false);
    }

    // Reference to the canvas and div element
    const canvas = document.getElementById('canvas-drawing');
    const graphDrawingDiv = document.getElementById('graph-drawing');

    // Get the drawing context of the canvas object. 2d as a parameter means 2D drawing
    // Canvas API of HTML5 (a way to inrteract with canvas)
    const ctx = canvas.getContext('2d');
    let path = new Path2D();

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

        let clientX = e.clientX;
        let clientY = e.clientY;

        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        // Return accurate mouse coordinates even when canvas is resized. 
        return {
            // Scale coordinates
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
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

    // Initiate drawing when mouse (or touch) is pressed
    canvas.onmousedown = canvas.ontouchstart = function(e) {
        e.preventDefault();  // Prevent scrolling 
        drawing = true;
        ctx.strokeStyle = '#B70000';

        // Define coordinates of the start position
        const { x, y } = getEventCanvasPosition(e);

        // Set drawing cursor to the start position
        path.moveTo(x, y);
        path.lineTo(x, y);
        ctx.stroke(path);
        lastX = x;
        lastY = y;
    }

    // Draw on canvas as the mouse is moved
    canvas.onmousemove = canvas.ontouchmove = function(e) {
        e.preventDefault();

        // If the mouse is pressed, draw
        if (drawing) {
            const { x, y } = getEventCanvasPosition(e);

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

    // Function to download the canvas content
    function getCanvasContent() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#000000';
        ctx.stroke(path);

        let canvasURL = canvas.toDataURL();
        const downloadElement = document.createElement('a');
        downloadElement.href = canvasURL;

        // This is the name of the downloaded file
        downloadElement.download = "download-this-canvas";

        downloadElement.click();
        downloadElement.remove();
    }

    // Function to send the canvas content on evaluation
    function sendCanvasToServer() {
        const canvasURLRed = canvas.toDataURL('image/png');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'green';
        ctx.stroke(path);

        const canvasURLGreen = canvas.toDataURL('image/png');

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
            body: JSON.stringify({ image: canvasURL, functionName: getKeyByValue(functions, randomEquation) }) // The content being send to server. 
            // Convert image into JSON string
        })
            .then(response => response.json()) // Recieve raw responce from the server, also returns a promise
            .then(data => {  // Process the response data, eg showing the result to the user
                console.log('Success:', data);
                checkEquationResults = checkEquation(data, functions, randomEquation);
                resultOn(checkEquationResults);

                encoded_answer = data.correct_function
                document.getElementById("image-answer").src = encoded_answer;

                if (checkEquationResults) {
                    document.getElementById("image-user-drawing").src = canvasURLGreen;
                }
                else {
                    document.getElementById("image-user-drawing").src = canvasURLRed;
                }

                randomEquation = getRandomEquation();
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, 'arcade-equation']);

            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }


    // Stop drawing when mouse is released
    canvas.onmouseup = canvas.ontouchend = () => {
        drawing = false;
        sendCanvasToServer();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        path = new Path2D();
    }

    canvas.onmouseleave = canvas.ontouchcancel = (e) => {
        if (drawing) {
            drawing = false;

            const { x, y } = getEventCanvasPosition(e);
            path.lineTo(x, y);
            ctx.stroke(path);

            sendCanvasToServer();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            path = new Path2D();
        }
    }
});
