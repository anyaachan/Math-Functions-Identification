from flask import Flask, render_template, request, jsonify

import tensorflow as tf
from tensorflow import keras
from keras.models import load_model
from keras.preprocessing import image

import numpy as np
import base64
from PIL import Image
import io

SIZE = 224, 224
AUTOTUNE = tf.data.AUTOTUNE

app = Flask(__name__)

@app.route("/")
def home():
    return render_template('main.html')

@app.route("/gamemode")
def gamemode():
    return render_template('gamemode.html')

@app.route("/howtoplay")
def howtoplay():
    return render_template('howtoplay.html')

@app.route("/arcade")
def arcade():
    return render_template('arcade.html')

@app.route("/pause")
def pause():
    return render_template('pause.html')

@app.route("/upload-image", methods = ['POST'])
def upload_image():
    data = request.json["image"] # Convert json to dictionary. This line extracts the Base64-encoded image data from the request payload using the key 'image'.
    # Decode the data
    header, encoded = data.split(",", 1)
    bytes_data = base64.b64decode(encoded)

    #Convert to an image 
    image = Image.open(io.BytesIO(bytes_data))

    white_background_image = Image.new("RGBA", image.size, "WHITE") # Create a white rgba background
    white_background_image.paste(image, (0, 0), image) # Paste original png image on top of the white background
    final_img = white_background_image.convert("RGB")

    # model = load_model("model.keras")

    # prediction = model.predict(final_img)

    # Return response as a JSON 
    return jsonify(result=data)

if __name__ == '__main__':
    app.run(debug=True)