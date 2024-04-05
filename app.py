from flask import Flask, render_template, request, jsonify
import base64
from PIL import Image
import io

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

    # Call model evaluation function here

    # Return response as a JSON 
    return jsonify(result=data)

if __name__ == '__main__':
    app.run(debug=True)