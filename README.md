# SketchMath ✏️
SketchMath is an **AI-powered educational game** that helps players learn to draw and understand **mathematical functions**. It uses neural networks to evaluate drawings and provide real-time feedback, making math learning interactive and fun!

## Features 🌟
- **Interactivity**: Draw the function and get instant feedback right in the game. The application accepts both touch and mouse events.
- **Game Modes**: Eternal, Arcade, and Mentor modes for different learning experiences.
- **Educational Resources**: Links to study materials to enhance understanding.
- **Responsive Design**: Works smoothly on both desktop and mobile.

## Tech Stack 🛠️
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python with Flask
- **AI Model**: MobileNet with TensorFlow
- **Data Handling and Generation**: Python libraries like Numpy, Matplotlib

## Data 📊 
The effectiveness of SketchMath's AI model relies on a dataset comprising:
- **Generated and Augmented Data**: Using Matplotlib, the images of mathematical functions were automatically generated. These images are then augmented through various transformations such as scaling and translating to mimic real-world variations and inaccuracies. Gaussian Filter was used to simulate hand-drawn appearance. 
- **Hand-Drawn Data**: Hand-drawn drawing images were collected with the help of the game's drawing interface to enhance the model's accuracy. 

## Screenshots
### Title Screen
<img width="1438" alt="image" src="https://github.com/anyaachan/Math-Functions-Identification/assets/53533713/ac741086-fcb8-4d0c-8606-6ab0989e5468">

### Gameplay (Arcade)
<img width="1440" alt="image" src="https://github.com/anyaachan/Math-Functions-Identification/assets/53533713/ba701a60-49b2-4631-bf59-4b2ace051d3f">

### 
