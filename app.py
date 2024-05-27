from flask import Flask, render_template, request, jsonify

import tensorflow as tf
from tensorflow.keras.models import load_model
import tensorflow_hub as hub

import numpy as np
import base64
from PIL import Image
import io

app = Flask(__name__)

SIZE = 224, 224
AUTOTUNE = tf.data.AUTOTUNE
ANSWERS_ROUTE = "pre_generated_functions"
CLASS_NAMES = ['absolute_linear', 'cubic', 'cubic_root', 'exponential', 'linear', 'logarithmic', 'negative_cubic', 'negative_cubic_root', 'negative_exponential', 'negative_linear', 'negative_quadratic', 'negative_square_root', 'not_valid', 'quadratic', 'square_negative_root', 'square_root']
MODEL_PATH = 'model/model.keras'

model = load_model(MODEL_PATH, custom_objects={'KerasLayer': hub.KerasLayer})

def decode_image(image_data):
    header, encoded = image_data.split(",", 1)
    bytes_data = base64.b64decode(encoded)
    return Image.open(io.BytesIO(bytes_data))

def prepare_image_for_model(image):
    white_background_image = Image.new("RGBA", image.size, "WHITE") # Create a white RGBA background
    white_background_image.paste(image, (0, 0), image) # Paste the image on a white background
    final_img = white_background_image.convert("RGB")

    final_img = final_img.resize(SIZE, Image.BILINEAR)
    final_img = np.array(final_img)
    final_img = np.expand_dims(final_img, axis=0)

    return final_img

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        encoded = base64.b64encode(image_file.read()).decode("utf-8")
        return f"data:image/png;base64,{encoded}"
    
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

@app.route("/mentor")
def mentor():
    return render_template('mentor.html')

@app.route("/eternal")
def eternal():
    return render_template('eternal.html')

@app.route("/upload-image", methods=['POST'])
def upload_image():
    try:
        function_name = request.json["functionName"]

        image = decode_image(request.json["image"])

        prediction = model.predict(prepare_image_for_model(image))
        pred_class = CLASS_NAMES[np.argmax(prediction)]

        answer_image_path = f"{ANSWERS_ROUTE}/{function_name}.png"
        answer_image_encoded = encode_image(answer_image_path)

        return jsonify(result=pred_class, correct_function=answer_image_encoded)

    except Exception as e:
        return jsonify({'error': str(e)}), 500 # Return error for debugging purposes


if __name__ == '__main__':
    app.run(debug=True)