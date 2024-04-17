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
ANSWERS_ROUTE = "pre_generated_functions"

class_names = ['cubic', 'linear', 'negative_cubic', 'negative_linear', 'negative_quadratic', 'quadratic', 'square_root']

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
        image_data = request.json["image"]
        function_name = request.json["functionName"]

        header, encoded = image_data.split(",", 1)
        bytes_data = base64.b64decode(encoded)

        image = Image.open(io.BytesIO(bytes_data))
        white_background_image = Image.new("RGBA", image.size, "WHITE")  # Create a white RGBA background
        white_background_image.paste(image, (0, 0), image)  # Paste the image on a white background
        final_img = white_background_image.convert("RGB")
        final_img = final_img.resize(SIZE, Image.BILINEAR)

        final_img = np.array(final_img)
        final_img = np.expand_dims(final_img, axis=0)
        prediction = model.predict(final_img)
        
        pred_class = class_names[np.argmax(prediction)]

        imagefile = open(ANSWERS_ROUTE + "/" + function_name + ".png", "rb")
        answer_image_encoded = base64.b64encode(imagefile.read())
        answer_image_encoded = answer_image_encoded.decode("utf-8")
        answer_image_encoded = "data:image/png;base64," + answer_image_encoded

        return jsonify(result=pred_class, correct_function=answer_image_encoded)

    except Exception as e:
        return jsonify({'error': str(e)}), 500 # Return error for debugging purposes


if __name__ == '__main__':
    app.run(debug=True)