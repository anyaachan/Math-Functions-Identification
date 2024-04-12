from flask import Flask, render_template, request, jsonify

import tensorflow as tf
import os, warnings

from tensorflow.keras import layers
from tensorflow.keras.models import Sequential
from tensorflow.keras.preprocessing import image_dataset_from_directory
from tensorflow.keras.preprocessing.image import load_img, img_to_array


from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

import tensorflow_hub as hub

import numpy as np
import base64
from PIL import Image
import io

app = Flask(__name__)

SIZE = 224, 224
AUTOTUNE = tf.data.AUTOTUNE

class_names = ['linear', 'negative_linear', 'negative_quadratic', 'quadratic']

model_path = 'model/model.keras'
model = load_model(model_path, custom_objects={'KerasLayer': hub.KerasLayer})

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

@app.route("/upload-image", methods=['POST'])
def upload_image():
    try:
        data = request.json["image"]

        header, encoded = data.split(",", 1)
        bytes_data = base64.b64decode(encoded)

        image = Image.open(io.BytesIO(bytes_data))
        white_background_image = Image.new("RGBA", image.size, "WHITE")  # Create a white RGBA background
        white_background_image.paste(image, (0, 0), image)  # Paste the image on a white background
        final_img = white_background_image.convert("RGB")
        final_img = final_img.resize(SIZE)

        final_img = np.array(final_img)
        final_img = np.expand_dims(final_img, axis=0)
        prediction = model.predict(final_img)
        
        pred_class = class_names[np.argmax(prediction)]

        return jsonify(result=pred_class)

    except Exception as e:
        return jsonify({'error': str(e)}), 500 # Return error for debugging purposes


if __name__ == '__main__':
    app.run(debug=True)