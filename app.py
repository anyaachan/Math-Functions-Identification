from flask import Flask, render_template, request, jsonify

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

    # Call model evaluation function here
    return jsonify(result="The result from your model")

if __name__ == '__main__':
    app.run(debug=True)